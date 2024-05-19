import ListProduct from '@/components/list-product';
import db from '@/lib/db';

async function getProducts() {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      created_at: true,
    },
  });

  return products;
}

export default async function Products() {
  const products = await getProducts();

  return (
    <div className='flex flex-col gap-5 p-5'>
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
    </div>
  );
}
