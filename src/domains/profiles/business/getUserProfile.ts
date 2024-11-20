import { ApiUserProfileOutput } from 'src/domains/profiles/schemas.js';
import { getUnauthenticatedRequestContext } from 'src/trpc/requestALS.js';

export async function getUserProfile(
  username: string
): Promise<ApiUserProfileOutput['profile']> {
  const { cb, userId } = getUnauthenticatedRequestContext();

  const {
    content: [{ value: bio }, { value: image }],
  } = await cb.collection('users').lookupIn(`user__${username}`).get('bio').get('image');

  if (!userId) {
    return {
      username,
      bio,
      image,
    };
  }

  const {
    content: [{ value: following }],
  } = await cb.collection('users').lookupIn(userId).exists(`follows.user__${username}`);

  return {
    username,
    bio,
    image,
    following: !!following,
  };
}
