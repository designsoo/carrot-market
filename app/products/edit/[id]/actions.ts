'use server';

import db from '@/lib/db';
import getSession from '@/lib/getSession';
import { productSchema } from '@/app/products/add/schema';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteImageUrl(imageId: string) {
  const response = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
      },
    )
  ).json();

  return response;
}

export default async function editProduct(formData: FormData) {
  const session = await getSession();
  if (!session.id) return;

  const data = {
    id: formData.get('id'),
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };

  const result = productSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const product = await db.product.update({
      where: {
        id: result.data.id,
      },
      data: {
        title: result.data.title,
        description: result.data.description,
        price: result.data.price,
        photo: result.data.photo,
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
    revalidateTag('product-detail');
    redirect(`/products/view/${product.id}`);
  }
}
