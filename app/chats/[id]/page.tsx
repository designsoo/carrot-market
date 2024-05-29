import ChatMessagesList from '@/components/chat-messages-list';
import db from '@/lib/db';
import getSession from '@/lib/getSession';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';

export async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id));
    if (!canSee) return null;
  }

  return room;
}

// 모든 채팅 메시지 가져오기
async function getMessage(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  return messages;
}

async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      avatar: true,
      username: true,
    },
  });

  return user;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessage>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const id = params.id;
  const room = await getRoom(id);

  if (!room) {
    return notFound();
  }

  const initialMessages = await getMessage(id);
  const session = await getSession();
  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }

  return (
    <ChatMessagesList
      chatRoomId={id}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar}
      initialMessages={initialMessages}
    />
  );
}
