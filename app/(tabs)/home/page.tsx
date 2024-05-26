import ProductList from '@/components/product-list';
import db from '@/lib/db';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/solid';
import { unstable_cache as nextCache, revalidatePath } from 'next/cache';

const getCachedProducts = nextCache(getInitialProducts, ['home-products'], {
  revalidate: 60,
});

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      created_at: true,
    },
    // take: 1,
    orderBy: {
      created_at: 'desc',
    },
  });

  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>;

export default async function Products() {
  const initialProducts = await getCachedProducts();
  const revalidate = async () => {
    'use server';
    revalidatePath('/home');
  };

  return (
    <>
      <div className='flex flex-col gap-5 p-5'>
        <ProductList initialProducts={initialProducts} />
      </div>
      <Link
        href='/products/add'
        className='fixed bottom-24 right-8 flex size-16 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400'
      >
        <PlusIcon className='size-10' />
      </Link>
    </>
  );
}
