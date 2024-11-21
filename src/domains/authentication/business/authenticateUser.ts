import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { appConfig } from 'src/config.js';
import { UserId } from 'src/database/schemas/ids.js';
import { ForbiddenError } from 'src/errors/ForbiddenError.js';
import { getRequestContext } from 'src/trpc/requestALS.js';
import { invariant } from 'src/utils/type-guards.js';

type AuthenticationResult = {
  userId: UserId;
  token: string;
  email: string;
  username: string;
  bio?: string;
  image?: string;
};

/**
 * Return the user id or throw if the user cannot be authenticated.
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthenticationResult> {
  const { cb } = getRequestContext();

  type QueryRow = {
    userId: UserId;
    username: string;
    password: string;
    bio?: string;
    image?: string;
  };

  const result = await cb.query<QueryRow>(
    'SELECT META().id AS userId, username, `password`, bio, image FROM users WHERE email = $1',
    {
      parameters: [email],
    }
  );

  if (result.rows.length !== 1) {
    throw new ForbiddenError();
  }

  const row = result.rows[0];
  invariant(row);

  const match = await bcrypt.compare(password, row.password);

  if (!match) {
    throw new ForbiddenError();
  }

  const token = jwt.sign({ userId: row.userId }, appConfig.JWT_SECRET, {
    expiresIn: '1h',
  });

  await cb.collection('users').mutateIn(row.userId).upsert('token', token);

  return {
    ...row,
    email,
    token,
  };
}
