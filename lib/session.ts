import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionContent {
  id?: number;
}

export default function getSesstion() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: 'accessToken',
    password: process.env.COOKIE_PASSWORD!,
  });
}
