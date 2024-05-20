'use client';

import { InitialProducts } from '@/app/(tabs)/products/page';
import ListProduct from './list-product';
import { useEffect, useRef, useState } from 'react';
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
  // observer trigger
  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          // trigger 감지되면 중지
          observer.unobserve(trigger.current);
          setIsLoading(true);

          // 상품 불러오기
          const newProducts = await getMoreProducts(page + 1);
          // 상품을 가진 리스트일 경우에만 +1
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0, // 상품을 가진 리스트일 경우에만 +1
      },
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    // 컴포넌트 unmount일 경우 중지
    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className='flex flex-col gap-5 p-5'>
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}

      {!isLastPage ? (
        <span
          ref={trigger}
          className='mx-auto w-fit rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold hover:opacity-90 active:scale-95'
        >
          {isLoading ? 'Loading...' : ' Load More'}
        </span>
      ) : null}
    </div>
  );
}
