import bcrypt from 'bcryptjs';

import {
  UserAuthenticationOutput,
  UserUpdateInput,
} from 'src/domains/authentication/schemas.js';
import { ForbiddenError } from 'src/errors/ForbiddenError.js';
import { getRequestContext } from 'src/trpc/requestALS.js';
import { invariant } from 'src/utils/type-guards.js';

export async function updateUser(
  data: UserUpdateInput['user']
): Promise<UserAuthenticationOutput['user']> {
  const { userId, token, cb } = getRequestContext();
  const { username, email, password, bio, image } = data;

  const mutations = cb.collection('users').mutateIn(userId);

  if (username && `user__${username}` !== userId) {
    const { exists } = await cb.collection('users').exists(`user__${username}`);

    if (exists) {
      throw new ForbiddenError('The username is already taken.');
    }

    // TODO need to rename (remove/insert) the user document
    mutations.replace('username', username);
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    mutations.replace('password', hashedPassword);
  }

  if (email) {
    mutations.replace('email', email);
  }

  if (bio) {
    mutations.upsert('bio', bio);
  }

  if (image) {
    mutations.upsert('image', image);
  }

  await mutations;

  const {
    content: [
      { value: storedBio },
      { value: storedImage },
      { value: storedEmail },
      { value: storedUsername },
    ],
  } = await cb
    .collection('users')
    .lookupIn(userId)
    .get('bio')
    .get('image')
    .get('email')
    .get('username');

  invariant(storedEmail);
  invariant(storedUsername);

  return {
    email: storedEmail,
    token,
    username: storedUsername,
    bio: storedBio,
    image: storedImage,
  };
}
