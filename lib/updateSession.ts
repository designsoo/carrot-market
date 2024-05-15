import getSession from '@/lib/getSession';

const updateSession = async (id: number) => {
  const session = await getSession();
  session.id = id;
  await session.save();
};

export default updateSession;
