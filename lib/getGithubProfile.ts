const getGithubProfile = async (accessToken: string) => {
  const {
    id,
    avatar_url: avatar,
    login: username,
  } = await (
    await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-cache',
    })
  ).json();

  return { id, avatar, username };
};

export default getGithubProfile;
