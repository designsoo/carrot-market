'use client';

import { Comments, UserInfo } from '@/types/comments';
import CommentForm from './comment-form';
import { formatToTimeAgo } from '@/lib/utils';
import Image from 'next/image';
import { addComment } from '@/app/posts/[id]/actions';
import { useOptimistic } from 'react';

interface CommentsProps {
  author: UserInfo;
  userId: number;
  postId: number;
  allComment: Comments;
}

export default function Comments({
  author,
  userId,
  postId,
  allComment,
}: CommentsProps) {
  const [comments, reducerFn] = useOptimistic(
    allComment,
    (prevComments, newComment: any) => [...prevComments, newComment],
  );

  const handleSubmit = async (payload: string, postId: number) => {
    const newComment = {
      id: comments.length + 1,
      payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      postId,
      userId,
    };

    reducerFn(newComment);
    await addComment(payload, postId);
  };

  const isAuthor = author?.id === userId;

  return (
    <div className='flex flex-col gap-4'>
      <div className='mt-6'>
        <div className='mb-2 flex items-center gap-2'>
          <h2>Comments </h2>
          <span className='text-l size-5 rounded-full bg-neutral-600 text-center text-xs leading-5 text-white'>
            {comments.length}
          </span>
        </div>
        <CommentForm handleSubmit={handleSubmit} postId={postId} isAuthor={isAuthor} />
      </div>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className='flex gap-3 border-b border-neutral-700 py-4'>
            <div className='relative size-10 shrink-0 overflow-hidden rounded-full'>
              <Image src={comment.user?.avatar ?? ''} alt='user-avatar' fill />
            </div>
            <div>
              <span className='text-sm font-semibold'>{comment.user?.username}</span>
              <p className='text-neutral-400'>{comment.payload}</p>
              <div>
                <span className='text-sm  text-neutral-400'>
                  {formatToTimeAgo(comment.created_at.toString())}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
