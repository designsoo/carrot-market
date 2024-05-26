import { getProduct } from '@/app/products/view/[id]/page';
import ModalButton from '@/components/modal-button';
import { formatToWon } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function Modal({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  if (isNaN(id)) return notFound();

  const product = await getProduct(id);

  if (!product) return notFound();

  return (
    <div className='absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60'>
      <div className='flex h-1/2 w-full max-w-screen-sm justify-center'>
        <ModalButton />
        <div className='relative aspect-square'>
          <Image
            fill
            className='object-cover'
            src={`${product.photo}/public`}
            alt={product.title}
          />
        </div>

        <div className='w-screen bg-neutral-500'>
          <div className='flex items-center gap-3 border-b border-neutral-700 p-5'>
            <div className='size-10 overflow-hidden rounded-full'>
              {product.user.avatar !== null ? (
                <Image
                  src={product.user.avatar}
                  width={40}
                  height={40}
                  alt={product.user.username}
                />
              ) : (
                <UserIcon />
              )}
            </div>
            <div>
              <h3>{product.user.username}</h3>
            </div>
          </div>

          <div className='p-5'>
            <h1 className='text-2xl font-semibold'>{product.title}</h1>
            <p>{product.description}</p>
          </div>
        </div>

        <div className='fixed bottom-0 left-0 flex w-full items-center justify-between bg-neutral-800 p-5 pb-10'>
          <span className='text-xl font-semibold'>{formatToWon(product.price)}원</span>
        </div>
      </div>
    </div>
  );
}
