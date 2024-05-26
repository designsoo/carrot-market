import { notFound } from 'next/navigation';
import { getCachedProduct } from '@/app/products/view/[id]/page';
import EditForm from '@/components/edit-form';

export default async function EditPoduct({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const product = await getCachedProduct(id);
  if (!product) return notFound();

  return <EditForm productId={id} product={product} />;
}
