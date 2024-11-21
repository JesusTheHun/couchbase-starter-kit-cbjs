import { type } from 'arktype';

import { arkUserId } from 'src/database/schemas/ids.js';

export const arkJwtPayload = type({
  userId: arkUserId,
}).onUndeclaredKey('delete');

export const arkApiUserRegistrationInput = type({
  user: {
    'email': 'string.email',
    'username': 'string >= 6',
    'password': 'string',
    'bio?': 'undefined | string',
    'image?': 'undefined | string',
  },
}).onDeepUndeclaredKey('reject');

export const arkApiUserLoginInput = type({
  user: {
    email: 'string.email',
    password: 'string',
  },
}).onDeepUndeclaredKey('reject');

export const arkApiUserAuthenticationOutput = type({
  user: {
    'email': 'string.email',
    'username': 'string',
    'token': 'string',
    'bio?': 'undefined | string',
    'image?': 'undefined | string',
  },
}).onDeepUndeclaredKey('delete');

export const arkApiUserUpdateInput = type({
  user: {
    'email?': 'undefined | string.email',
    'username?': 'undefined | string >= 6',
    'password?': 'undefined | string',
    'bio?': 'undefined | string',
    'image?': 'undefined | string',
  },
}).onDeepUndeclaredKey('reject');

export type UserRegistrationInput = typeof arkApiUserRegistrationInput.infer;
export type UserUpdateInput = typeof arkApiUserUpdateInput.infer;
export type UserAuthenticationOutput = typeof arkApiUserAuthenticationOutput.infer;
