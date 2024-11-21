import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { appConfig } from 'src/config.js';
import { arkUserId } from 'src/database/models/ids.js';
import { arkUserDocument } from 'src/database/models/user.js';
import {
  UserAuthenticationOutput,
  UserRegistrationInput,
} from 'src/domains/authentication/schemas.js';
import { ForbiddenError } from 'src/errors/ForbiddenError.js';
import { getUnauthenticatedRequestContext } from 'src/trpc/requestALS.js';

export async function registerUser(
  data: UserRegistrationInput
): Promise<UserAuthenticationOutput['user']> {
  const { cb } = getUnauthenticatedRequestContext();
  const { username, email, password, bio, image } = data.user;

  const { exists } = await cb.collection('users').exists(`user__${username}`);

  if (exists) {
    throw new ForbiddenError('The username is already taken.');
  }

  const userId = arkUserId.assert(`user__${username}`);
  const hashedPassword = await bcrypt.hash(password, 10);
  const token = jwt.sign({ userId }, appConfig.JWT_SECRET, {
    expiresIn: '1h',
  });

  await cb.collection('users').insert(
    userId,
    arkUserDocument.assert({
      username,
      email,
      password: hashedPassword,
      token,
      bio,
      image,
      follows: {},
      favorites: {},
    })
  );

  return {
    username,
    email,
    token,
  };
}
