'use client';

import { EyeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from '@heroicons/react/24/outline';
import { useOptimistic } from 'react';
import { disLikePost, likePost } from '@/app/posts/[id]/actions';

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
  userId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
  userId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    }),
  );

  const onClick = async () => {
    reducerFn(undefined);

    if (isLiked) {
      await disLikePost(postId, userId);
    } else {
      await likePost(postId, userId);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border border-neutral-400 p-2 text-sm text-neutral-400 transition-colors  ${state.isLiked ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600' : 'hover:bg-neutral-800'}`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className='size-5' />
      ) : (
        <OutlineHandThumbUpIcon className='size-5' />
      )}

      {state.isLiked ? (
        <span>{state.likeCount}</span>
      ) : (
        <span>공감하기{state.likeCount}</span>
      )}
    </button>
  );
}
