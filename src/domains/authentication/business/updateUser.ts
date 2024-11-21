import bcrypt from 'bcryptjs';

import { UserId } from 'src/database/schemas/ids.js';
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

  const nextUserId: UserId = username ? `user__${username}` : userId;

  // No change in username
  if (!username || nextUserId === userId) {
    await mutations;
  }

  // Change in username
  // We need to change the document key ; the only way to do that is to insert a new doc and remove the old one
  if (username && nextUserId !== userId) {
    const { exists } = await cb.collection('users').exists(`user__${username}`);

    if (exists) {
      throw new ForbiddenError('The username is already taken.');
    }

    // We set this property so in the event of an app crash between deletion and creation,
    // we can still reconcile the state of data

    mutations.insert('replacedBy', nextUserId);
    await mutations;

    const { content: doc } = await cb.collection('users').get(userId);

    const { replacedBy, ...rest } = doc;
    await cb.collection('users').insert(nextUserId, {
      ...rest,
      username,
    });

    await cb.collection('users').remove(userId);
  }

  const {
    content: [
      { value: storedBio },
      { value: storedImage },
      { value: storedEmail },
      { value: storedUsername },
    ],
  } = await cb
    .collection('users')
    .lookupIn(nextUserId)
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
