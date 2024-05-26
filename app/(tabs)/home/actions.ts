'use server';

import db from '@/lib/db';

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      created_at: true,
    },
    skip: page * 1,
    take: 1,
    orderBy: {
      created_at: 'desc',
    },
  });

  return products;
}
