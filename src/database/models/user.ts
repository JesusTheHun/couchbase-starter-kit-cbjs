import { type } from 'arktype';

import { arkUserId } from 'src/database/models/ids.js';

export const arkUserDocument = type({
  'email': 'string.email',
  'username': 'string >= 4',
  'password': 'string',
  'token?': 'undefined | string',
  'bio?': 'undefined | string',
  'image?': 'undefined | string',
  'follows': type.Record(arkUserId, {
    since: 'number.epoch',
  }),
});

export type UserDocument = typeof arkUserDocument.infer;
