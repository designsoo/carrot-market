'use server';

import db from '@/lib/db';
import { formatToTimeAgo } from '@/lib/utils';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { EyeIcon } from '@heroicons/react/24/solid';
import getSession from '@/lib/getSession';
import { unstable_cache as nextCache } from 'next/cache';
import LikeButton from '@/components/like-button';
import { getComments, getPost, getUser } from './actions';
import Comments from '@/components/comments';

const getCachedPost = nextCache(getPost, ['post-detail'], {
  tags: ['post-detail'],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      },
    },
  });

  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });

  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

function getCachedLikeStatus(postId: number, userId: number) {
  const cachedOpertaion = nextCache(getLikeStatus, ['post-like-status'], {
    tags: [`like-status-${postId}`],
  });

  return cachedOpertaion(postId, userId);
}

function getCachedComments(postId: number) {
  const cachedOperation = nextCache(getComments, ['comment-list'], {
    tags: [`comments-${postId}`],
  });

  return cachedOperation(postId);
}

export default async function PostDetail({ params }: { params: { id: string } }) {
  const session = await getSession();
  const userId = session.id;

  if (!userId) return;

  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const post = await getCachedPost(id);
  if (!post) return notFound();

  const { likeCount, isLiked } = await getCachedLikeStatus(id, userId);
  const comments = await getCachedComments(id);

  return (
    <div className='p-5 text-white'>
      <div className='mb-2 flex items-center gap-2'>
        <Image
          width={28}
          height={28}
          className='size-7 rounded-full'
          src={post.user.avatar!}
          alt={post.user.username}
        />
        <div>
          <span className='text-sm font-semibold'>{post.user.username}</span>
          <div className='text-xs'>
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className='text-lg font-semibold'>{post.title}</h2>
      <p className='mb-5'>{post.description}</p>
      <div className='flex flex-col items-start gap-5'>
        <div className='flex items-center gap-2 text-sm text-neutral-400'>
          <EyeIcon className='size-5' />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} userId={userId} />
      </div>

      <Comments author={post.user} userId={userId} postId={id} allComment={comments} />
    </div>
  );
}
