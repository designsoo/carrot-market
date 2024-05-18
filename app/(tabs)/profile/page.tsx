import db from '@/lib/db';
import getSession from '@/lib/getSession';
import { notFound, redirect } from 'next/navigation';

const getUser = async () => {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
};

const Profile = async () => {
  const user = await getUser();
  const logOut = async () => {
    'use server';
    const session = await getSession();
    await session.destroy();
    redirect('/');
  };

  return (
    <div>
      <h1>Welcome {user?.username}!</h1>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
};

export default Profile;
