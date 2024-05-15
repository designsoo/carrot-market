import db from './db';

const isExistUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
};

export default isExistUsername;
