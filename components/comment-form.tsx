'use client';

import { FormEvent } from 'react';

interface CommentFormProps {
  postId: number;
  handleSubmit: (payload: string, postId: number) => Promise<void>;
  isAuthor: boolean;
}

export default function CommentForm({
  postId,
  handleSubmit,
  isAuthor,
}: CommentFormProps) {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = formData.get('payload') as string;
    await handleSubmit(payload, postId);
  }

  return (
    <form onSubmit={onSubmit} className=' flex flex-col gap-3'>
      <textarea
        name='payload'
        placeholder='댓글을 입력해주세요.'
        className='resize-none rounded-lg bg-neutral-900'
      ></textarea>
      <button
        disabled={isAuthor}
        className='rounded-lg bg-orange-500 py-2 hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-400'
      >
        Post
      </button>
    </form>
  );
}
