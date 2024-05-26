import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import getSession from '@/lib/getSession';
import { formatToWon } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/24/solid';
import DeletButton from './delet-button';
import { unstable_cache as nextCache } from 'next/cache';

type Params = {
  params: { id: string };
};

// 로그인한 계정이 작성자인지 확인
async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

// 1-1. 등록된 상품 상세 내용(작성자 정보 포함)
export async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return product;
}

// 1-2. 상품 상세 내용 전체 캐싱
export const getCachedProduct = nextCache(getProduct, ['product-detail'], {
  tags: ['product-detail'],
});

// 2-1. 상품 상세 내용 중 타이틀만 받아오기
export async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });

  return product;
}

// 2-2. 타이틀만 캐싱
const getCachedProductTitle = nextCache(getProductTitle, ['product-title'], {
  tags: ['product-title'],
});

// 2-3. Dynamic metadata
export async function generateMetadata({ params }: Params) {
  const id = Number(params.id);
  const product = await getCachedProductTitle(id);

  return {
    title: product?.title,
  };
}

export default async function ProductDetail({ params }: Params) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  // 1-3. 캐시에 넣어둔 제품 상세 정보 사용
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }

  const imageId = product.photo
    .split('https://imagedelivery.net/gHftqKLNBQ-NOWw8XS0zUw/')
    .join('');

  // 로그인한 유저와 작성자가 동일한지 확인
  const isOwner = await getIsOwner(product.userId);

  return (
    <div>
      <div className='relative aspect-square'>
        <Image
          fill
          className='object-cover'
          src={`${product.photo}/public`}
          alt={product.title}
        />
      </div>
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
        {isOwner && (
          <Link
            href={`/products/edit/${[id]}`}
            className='h-10 rounded-lg bg-orange-500 px-4 leading-10 text-white hover:bg-orange-600'
          >
            수정하기
          </Link>
        )}
      </div>
      <div className='p-5'>
        <h1 className='text-2xl font-semibold'>{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className='fixed bottom-0 left-0 flex w-full items-center justify-between bg-neutral-800 p-5 pb-10'>
        <span className='text-xl font-semibold'>{formatToWon(product.price)}원</span>
        {isOwner ? (
          <DeletButton productId={product.id} imageId={imageId} />
        ) : (
          <Link
            className='rounded-md bg-orange-500 px-5 py-2.5 font-semibold text-white'
            href={``}
          >
            채팅하기
          </Link>
        )}
      </div>
    </div>
  );
}
