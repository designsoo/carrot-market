import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import updateSession from '@/lib/updateSession';
import isExistUsername from '@/lib/isExistUsername';
import getGithubToken from '@/lib/getGithubToken';
import getGithubProfile from '@/lib/getGithubProfile';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  const { error, access_token } = await getGithubToken(code);
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const { id, avatar, username } = await getGithubProfile(access_token);
  const registerUser = await db.user.findUnique({
    where: {
      github_id: id + '',
    },
    select: {
      id: true,
    },
  });

  if (registerUser) {
    await updateSession(registerUser.id);
    return redirect('/profile');
  } else {
    const isExistUser = await isExistUsername(username);

    const uewUser = await db.user.create({
      data: {
        username: isExistUser ? `${username}-gh` : username,
        github_id: id + '',
        avatar,
      },
      select: {
        id: true,
      },
    });

    await updateSession(uewUser.id);
    return redirect('/profile');
  }
}
