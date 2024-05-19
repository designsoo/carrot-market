import ProductList from '@/components/product-list';
import db from '@/lib/db';
import { Prisma } from '@prisma/client';

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      created_at: true,
    },
    take: 1,
    orderBy: {
      created_at: 'desc',
    },
  });

  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>;

export default async function Products() {
  const initialProducts = await getInitialProducts();

  return (
    <div className='flex flex-col gap-5 p-5'>
      <ProductList initialProducts={initialProducts} />
    </div>
  );
}
