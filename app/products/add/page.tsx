'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import uploadProduct, { getUploadUrl } from './actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductType, productSchema } from './schema';

const MB = 1024 * 1024;

export default function AddProduct() {
  const [preview, setPreview] = useState('');
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

  const isFileSizeExceeded = (file: File) => file.size > 3 * MB;

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // 1. 유저가 이미지를 업로드 했는지 확인
    const {
      target: { files },
    } = event;
    if (!files) return;

    const file = files[0];
    // 2. 이미지 최대 사이즈 3MB 이하인지 확인
    if (isFileSizeExceeded(file)) {
      alert('3MB 이하인 이미지만 첨부 가능합니다.');
      return;
    }
    // 3. 업로드 이미지 미리보기
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
    // 이미지 cloudflare 업로드
    if (!file) {
      alert('이미지 등록은 필수 입니다.');
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append('file', file);
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      return;
    }
    // formData의 'photo' 대체하기
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('price', data.price + '');
    formData.append('description', data.description);
    formData.append('photo', data.photo);
    // 상품 업로드 요청
    return uploadProduct(formData);
  });

  const onValid = async () => {
    await onSubmit(); // react-hook-form에 의해 자동으로 호출
  };

  return (
    <div>
      <form action={onValid} className='flex flex-col gap-5 p-5'>
        <label
          htmlFor='photo'
          className='flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-cover bg-center text-neutral-300'
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === '' && (
            <>
              <PhotoIcon className='w-20' />
              <div className='text-neutral-400'>
                사진을 추가해주세요. {errors.photo?.message}
              </div>
            </>
          )}
        </label>
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
          type='text'
          placeholder='제목'
          errors={[errors.title?.message ?? '']}
          required
        />
        <Input
          {...register('price')}
          type='number'
          placeholder='가격'
          errors={[errors.price?.message ?? '']}
          required
        />
        <Input
          {...register('description')}
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
