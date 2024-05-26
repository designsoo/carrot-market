'use client';

import { deleteImageUrl } from '../../edit/[id]/actions';
import handleDeleteProduct from './actions';

interface DeletButtonProps {
  productId: number;
  imageId: string;
}

export default function DeletButton({ productId, imageId }: DeletButtonProps) {
  async function onDelete() {
    await handleDeleteProduct(productId);
    await deleteImageUrl(imageId);
  }

  return (
    <button
      type='button'
      onClick={onDelete}
      className='rounded-md bg-red-500 px-5 py-2.5 font-semibold text-white'
    >
      Delete product
    </button>
  );
}
