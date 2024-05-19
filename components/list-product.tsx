import { formatToTimeAgo, formatToWon } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ListProductProps {
  id: number;
  title: string;
  price: number;
  photo: string;
  created_at: Date;
}

export default function ListProduct({
  id,
  title,
  price,
  photo,
  created_at,
}: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className='flex gap-5'>
      <div className='relative size-28 shrink-0 overflow-hidden rounded-md'>
        <Image fill src={photo} alt={title} className='object-cover' />
      </div>
      <div className='flex flex-col gap-1 *:text-white'>
        <span className='text-lg'>{title}</span>
        <span className='text-sm text-neutral-500'>
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className='text-lg font-semibold'>{formatToWon(price)}원</span>
      </div>
    </Link>
  );
}
