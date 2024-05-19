'use client';

import { InitialProducts } from '@/app/(tabs)/products/page';
import ListProduct from './list-product';
import { useState } from 'react';
import { getMoreProducts } from '@/app/(tabs)/products/actions';

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  // 상품 리스트 (초기에 하나만 불러와짐)
  const [products, setProducts] = useState(initialProducts);
  // 페이지 1씩 추가
  const [page, setPage] = useState(0);
  // 마지막 페이지 확인
  const [isLastPage, setIsLastPage] = useState(false);
  // 데이터 로딩중
  const [isLoading, setIsLoading] = useState(false);

  // 버튼 클릭 시 하나씩 추가되는 함수
  const onLoadMoreProduct = async () => {
    setIsLoading(true);
    const newProduct = await getMoreProducts(page + 1);

    // 상품을 가진 리스트일 경우에만 +1
    if (newProduct.length !== 0) {
      setPage((prev) => prev + 1);
      setProducts((prev) => [...prev, ...newProduct]);
    } else {
      setIsLastPage(true);
    }
    setIsLoading(false);
  };

  return (
    <div className='flex flex-col gap-5 p-5'>
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {isLastPage ? (
        'No more items'
      ) : (
        <button
          className='mx-auto w-fit rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold hover:opacity-90 active:scale-95'
          disabled={isLoading}
          onClick={onLoadMoreProduct}
        >
          {isLoading ? 'Loading...' : ' Load More'}
        </button>
      )}
    </div>
  );
}
