async function getProducts() {
  const res = await fetch(`${process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL}/api/products?populate=*`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des données');
  }
  return res.json();
}

export default async function Home() {
  const { data: products } = await getProducts();

  return (
    <main className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Boutique d&apos;Accessoires
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="bg-white p-5 rounded-lg shadow-md">
            {product.image?.url && (
              <div className="relative w-full h-48 mb-4">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${product.image.url}`}
                  alt={product.title}
                  className="object-cover w-full h-full rounded"
                />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.title}</h2>
            {product.category && (
              <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
            )}
            <p className="text-blue-600 font-bold text-lg">{product.price} €</p>
          </div>
        ))}
      </div>
    </main>
  );
}

