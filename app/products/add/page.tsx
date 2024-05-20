'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import uploadProduct, { getUploadUrl } from './actions';
import { useFormState } from 'react-dom';

const MB = 1024 * 1024;

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [photoId, setPhotoId] = useState('');

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
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setPhotoId(id);
    }
  };

  const interceptAction = async (_: any, formData: FormData) => {
    // 이미지 cloudflare 업로드
    const file = formData.get('photo');
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
    const photoUrl = `https://imagedelivery.net/gHftqKLNBQ-NOWw8XS0zUw/${photoId}`;
    formData.set('photo', photoUrl);
    // 상품 업로드 요청
    return uploadProduct(_, formData);
  };
  const [state, dispatch] = useFormState(interceptAction, null);

  return (
    <div>
      <form action={dispatch} className='flex flex-col gap-5 p-5'>
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
                사진을 추가해주세요. {state?.fieldErrors.photo}
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
          name='title'
          type='text'
          placeholder='제목'
          errors={state?.fieldErrors.title}
          required
        />
        <Input
          name='price'
          type='number'
          placeholder='가격'
          errors={state?.fieldErrors.price}
          required
        />
        <Input
          name='description'
          type='text'
          placeholder='자세한 설명'
          errors={state?.fieldErrors.description}
          required
        />
        <Button text='작성 완료' />
      </form>
    </div>
  );
}
