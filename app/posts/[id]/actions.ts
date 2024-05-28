'use server';

import db from '@/lib/db';
import { revalidatePath, revalidateTag } from 'next/cache';
import getSession from '@/lib/getSession';

// ---- 특정 post 상세정보
export async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  } catch (e) {
    return null;
  }
}

// ---- 포스트 좋아요
export const likePost = async (id: number, userId: number) => {
  'use server';
  await new Promise((r) => setTimeout(r, 10000));
  try {
    await db.like.create({
      data: {
        postId: id,
        userId,
      },
    });

    revalidatePath('/life');
    revalidateTag(`like-status-${id}`);
  } catch (e) {}
};

// ---- 포스트 좋아요 취소
export const disLikePost = async (id: number, userId: number) => {
  'use server';
  await new Promise((r) => setTimeout(r, 10000));
  try {
    await db.like.delete({
      where: {
        id: {
          postId: id,
          userId,
        },
      },
    });

    revalidatePath('/life');
    revalidateTag(`like-status-${id}`);
  } catch (e) {}
};

// ---- 댓글 등록하기
export async function addComment(payload: string, postId: number) {
  const session = await getSession();
  if (!session.id) return;

  const comment = await db.comment.create({
    data: {
      payload,
      userId: session.id!,
      postId,
    },
  });

  revalidateTag(`comments-${postId}`);
  return comment;
}

// ---- 전체 댓글 가져오기
export async function getComments(id: number) {
  const comments = await db.comment.findMany({
    where: {
      postId: id,
    },
    include: {
      user: {
        select: {
          id: true,
          avatar: true,
          username: true,
        },
      },
    },
  });

  return comments;
}

// ---- 사용자 정보 가져오기
export async function getUser() {
  const session = await getSession();

  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      id: true,
      avatar: true,
      username: true,
    },
  });

  return user;
}
