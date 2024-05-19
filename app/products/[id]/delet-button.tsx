'use client';

import handleDeleteProduct from './actions';

interface DeletButtonProps {
  productId: number;
}

export default function DeletButton({ productId }: DeletButtonProps) {
  async function onDelete() {
    await handleDeleteProduct(productId);
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
