'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function handleDeleteProduct(id: number) {
  await db.product.delete({
    where: {
      id,
    },
  });

  revalidatePath('/home');
  return redirect('/home');
}
