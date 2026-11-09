import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::contact-message.contact-message',
  ({ strapi }) => ({
    async submit(ctx) {
      const expectedSecret = process.env.STORE_API_SECRET;
      const receivedSecret = ctx.request.headers['x-store-secret'];

      if (!expectedSecret || receivedSecret !== expectedSecret) {
        return ctx.unauthorized('Unauthorized');
      }

      const body = ctx.request.body as any;

      if (
        typeof body?.name !== 'string' ||
        typeof body?.email !== 'string' ||
        typeof body?.message !== 'string'
      ) {
        return ctx.badRequest('Invalid message data');
      }

      const name = body.name.trim();
      const email = body.email.trim().toLowerCase();
      const message = body.message.trim();

      if (
        !name ||
        name.length > 120 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        email.length > 254 ||
        message.length < 10 ||
        message.length > 5000
      ) {
        return ctx.badRequest('Invalid message data');
      }

      const saved = await strapi
        .documents('api::contact-message.contact-message')
        .create({
          data: {
            name,
            email,
            message,
            status: 'new',
          },
        });

      ctx.status = 201;
      ctx.body = {
        data: {
          id: saved.documentId,
          message: 'Message received successfully',
        },
      };
    },
  })
);
