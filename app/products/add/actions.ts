'use server';

import db from '@/lib/db';
import getSession from '@/lib/getSession';
import { redirect } from 'next/navigation';
import { productSchema } from './schema';
import { revalidatePath } from 'next/cache';

export default async function uploadProduct(formData: FormData) {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          photo: result.data.photo,
          title: result.data.title,
          price: result.data.price,
          description: result.data.description,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      revalidatePath('/home');
      redirect(`/products/view/${product.id}`);
    }
  }
}

export async function getUploadUrl() {
  const response = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
      },
    )
  ).json();

  return response;
}
