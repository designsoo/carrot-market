import db from '@/lib/db';
import getSesstion from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

const getUser = async () => {
  const sesstion = await getSesstion(); // {id: 9}
  if (sesstion.id) {
    const user = await db.user.findUnique({
      where: {
        id: sesstion.id,
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
    const sesstion = await getSesstion();
    await sesstion.destroy();
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
