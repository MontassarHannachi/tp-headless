
import { factories } from '@strapi/strapi';
import { createHash, randomBytes } from 'node:crypto';

export default factories.createCoreController(
  'api::order.order',
  ({ strapi }) => ({
    async checkout(ctx) {
      // 1. Vérification du secret interne
      const expectedSecret = process.env.STORE_API_SECRET;
      const receivedSecret = ctx.request.headers['x-store-secret'];

      if (!expectedSecret || receivedSecret !== expectedSecret) {
        return ctx.unauthorized('Unauthorized');
      }

      const body = ctx.request.body as any;
      const idempotencyKey = body?.idempotencyKey;

      if (
        typeof idempotencyKey !== 'string' ||
        !/^[a-zA-Z0-9._:-]{16,128}$/.test(idempotencyKey)
      ) {
        return ctx.badRequest('Invalid idempotency key');
      }

      const customer = body?.customer ?? {
        name: body?.customerName,
        email: body?.email,
        address: body?.address,
        city: body?.city,
        postalCode: body?.postalCode,
      };

      const items = body?.items;

      // 2. Validation du client
      if (
        !customer ||
        typeof customer.name !== 'string' ||
        typeof customer.email !== 'string' ||
        typeof customer.address !== 'string' ||
        typeof customer.city !== 'string' ||
        typeof customer.postalCode !== 'string'
      ) {
        return ctx.badRequest('Invalid customer information');
      }

      const name = customer.name.trim();
      const email = customer.email.trim().toLowerCase();
      const address = customer.address.trim();
      const city = customer.city.trim();
      const postalCode = customer.postalCode.trim();

      if (
        !name ||
        name.length > 120 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        email.length > 254 ||
        !address ||
        address.length > 250 ||
        !city ||
        city.length > 100 ||
        !/^\d{4,5}$/.test(postalCode)
      ) {
        return ctx.badRequest('Invalid customer information');
      }

      // 3. Validation des articles
      if (!Array.isArray(items) || items.length < 1 || items.length > 30) {
        return ctx.badRequest('Invalid order items');
      }

      const quantities = new Map<string, number>();

      for (const item of items) {
        if (
          typeof item?.productDocumentId !== 'string' ||
          !item.productDocumentId.trim() ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1 ||
          item.quantity > 99
        ) {
          return ctx.badRequest('Invalid product or quantity');
        }

        const id = item.productDocumentId.trim();
        const newQuantity = (quantities.get(id) || 0) + item.quantity;

        if (newQuantity > 99) {
          return ctx.badRequest('Maximum quantity per product is 99');
        }

        quantities.set(id, newQuantity);
      }

      // 4. Empreinte déterministe de la requête
      const normalizedItems = [...quantities.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([productDocumentId, quantity]) => ({
          productDocumentId,
          quantity,
        }));

      const requestFingerprint = createHash('sha256')
        .update(
          JSON.stringify({
            customer: { name, email, address, city, postalCode },
            items: normalizedItems,
          })
        )
        .digest('hex');

      // 5. Recherche d'une commande déjà créée
      const findExistingOrder = () =>
        strapi.db.query('api::order.order').findOne({
          where: { idempotencyKey },
        });

      const returnExistingOrder = (existing: any) => {
        if (existing.requestFingerprint !== requestFingerprint) {
          ctx.status = 409;
          ctx.body = {
            error: {
              message:
                'Cette clé de commande a déjà été utilisée avec des données différentes.',
            },
          };
          return;
        }

        ctx.status = 200;
        ctx.body = {
          data: {
            orderNumber: existing.orderNumber,
            total: existing.total,
            currency: existing.currency,
          },
        };
      };

      const existingOrder = await findExistingOrder();

      if (existingOrder) {
        return returnExistingOrder(existingOrder);
      }

      // 6. Calcul du prix exclusivement côté serveur
      const orderItems = [];
      let totalCents = 0;

      for (const [documentId, quantity] of quantities) {
        const product = await strapi
          .documents('api::product.product')
          .findOne({
            documentId,
            status: 'published',
          });

        if (!product) {
          return ctx.badRequest('A product is unavailable');
        }

        const unitPrice = Number(product.price);

        if (!Number.isFinite(unitPrice) || unitPrice < 0) {
          return ctx.badRequest('Invalid product price');
        }

        const unitPriceCents = Math.round(unitPrice * 100);
        const lineTotalCents = unitPriceCents * quantity;

        totalCents += lineTotalCents;

        orderItems.push({
          productDocumentId: documentId,
          title: product.title,
          quantity,
          unitPrice: (unitPriceCents / 100).toFixed(2),
          lineTotal: (lineTotalCents / 100).toFixed(2),
        });
      }

      // 7. Création protégée par l'index unique SQLite
      const orderNumber =
        'CMD-' + randomBytes(5).toString('hex').toUpperCase();

      try {
        const order = await strapi.documents('api::order.order').create({
          data: {
            orderNumber,
            idempotencyKey,
            requestFingerprint,
            customerName: name,
            email,
            address,
            city,
            postalCode,
            items: orderItems,
            total: (totalCents / 100).toFixed(2),
            currency: 'EUR',
            status: 'pending',
          },
        });

        ctx.status = 201;
        ctx.body = {
          data: {
            orderNumber: order.orderNumber,
            total: order.total,
            currency: order.currency,
          },
        };
      } catch (error) {
        // 8. Une requête concurrente a peut-être déjà créé la commande
        const concurrentOrder = await findExistingOrder();

        if (concurrentOrder) {
          return returnExistingOrder(concurrentOrder);
        }

        throw error;
      }
    },
  })
);
