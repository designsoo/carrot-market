'use client';

import Input from '@/components/input';
import { ProductType, productSchema } from '@/app/products/add/schema';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getUploadUrl } from '@/app/products/add/actions';
import editProduct, { deleteImageUrl } from '@/app/products/edit/[id]/actions';
import Button from './button';
import { isFileSizeExceeded } from '@/lib/isFileSizeExceeded';

interface EditFormProps {
  productId: number;
  product: ProductType;
}

const MAXIMUM_FILE_SIZE = 3;

export default function EditForm({ productId, product }: EditFormProps) {
  const prevImageId = product.photo
    .split('https://imagedelivery.net/gHftqKLNBQ-NOWw8XS0zUw/')
    .join('');

  const [preview, setPreview] = useState(`${product.photo}/public`);
  const [uploadUrl, setUploadUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;

    const file = files[0];

    if (isFileSizeExceeded(file, MAXIMUM_FILE_SIZE)) {
      alert('3MB 이하인 이미지만 첨부 가능합니다.');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);

    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      const photoUrl = `https://imagedelivery.net/gHftqKLNBQ-NOWw8XS0zUw/${id}`;
      setUploadUrl(uploadURL);
      setValue('photo', photoUrl);
    }
  };

  const onSubmit = handleSubmit(async (data: ProductType) => {
    if (file) {
      // 새로운 이미지로 변경하고 싶은 경우 -> 등록된 이미지 CDN에서 삭제
      await deleteImageUrl(prevImageId);

      const cloudflareForm = new FormData();
      cloudflareForm.append('file', file);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: cloudflareForm,
      });

      if (response.status !== 200) {
        return;
      }
    }

    const formData = new FormData();
    formData.append('id', productId + '');
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price + '');
    formData.append('photo', data.photo);

    // 상품 업로드
    return editProduct(formData);
  });

  const onValid = async () => {
    await onSubmit();
  };

  useEffect(() => {
    setValue('photo', product.photo);
  }, [product]);

  return (
    <div>
      <form action={onValid} className='flex flex-col gap-5 p-5'>
        <label
          htmlFor='photo'
          className='flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-cover bg-center text-neutral-300'
          style={{
            backgroundImage: `url(${preview})`,
          }}
        ></label>
        <input
          onChange={onImageChange}
          type='file'
          id='photo'
          name='photo'
          accept='image/*'
          className='hidden'
        />
        <Input
          {...register('title')}
          defaultValue={product.title}
          type='text'
          placeholder='제목'
          errors={[errors.title?.message ?? '']}
          required
        />
        <Input
          {...register('price')}
          defaultValue={product.price}
          type='number'
          placeholder='가격'
          errors={[errors.price?.message ?? '']}
          required
        />
        <Input
          {...register('description')}
          defaultValue={product.description}
          type='text'
          placeholder='자세한 설명'
          errors={[errors.description?.message ?? '']}
          required
        />
        <Button text='작성 완료' />
      </form>
    </div>
  );
}
