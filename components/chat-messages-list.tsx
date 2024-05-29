'use client';

import { InitialChatMessages } from '@/app/chats/[id]/page';
import { saveMessage } from '@/app/chats/actions';
import { formatToTimeAgo } from '@/lib/utils';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { RealtimeChannel, createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

const SUPABASE_PUBLIC_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbmt2cnNsaWtqanZ1cXJxb292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY5NzkxNTYsImV4cCI6MjAzMjU1NTE1Nn0.XtFt5NxGevrbhFJMQHSJR_kKjMCS1jpo_YMo4-ggUZs';

const SUPABASE_URL = 'https://nonkvrslikjjvuqrqoov.supabase.co';

interface ChatMessageListProps {
  chatRoomId: string;
  userId: number;
  initialMessages: InitialChatMessages;
  username: string;
  avatar: string | null;
}

export default function ChatMessagesList({
  chatRoomId,
  userId,
  initialMessages,
  username,
  avatar,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState('');
  const channel = useRef<RealtimeChannel>();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: '',
          avatar: null,
        },
      },
    ]);
    channel.current?.send({
      type: 'broadcast',
      event: 'message',
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: { username, avatar },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage('');
  };

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on('broadcast', { event: 'message' }, (payload) => {
        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <div className='flex min-h-screen flex-col justify-end gap-5 p-5'>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-2 ${
            message.userId === userId ? 'justify-end' : ''
          }`}
        >
          {message.userId === userId ? null : (
            <Image
              src={message.user.avatar!}
              alt={message.user.username}
              width={50}
              height={50}
              className='size-8 rounded-full'
            />
          )}
          <div
            className={`flex flex-col gap-1 ${
              message.userId === userId ? 'items-end' : ''
            }`}
          >
            <span
              className={`${
                message.userId === userId ? 'bg-neutral-500' : 'bg-orange-500'
              } max-w-[400px] rounded-md p-2.5`}
            >
              {message.payload}
            </span>
            <span className='text-xs'>
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form className='relative flex' onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className='h-10 w-full rounded-full border-none bg-transparent px-5 ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-neutral-50'
          type='text'
          name='message'
          placeholder='Write a message...'
        />
        <button className='absolute right-0'>
          <ArrowUpCircleIcon className='size-10 text-orange-500 transition-colors hover:text-orange-300' />
        </button>
      </form>
    </div>
  );
}
