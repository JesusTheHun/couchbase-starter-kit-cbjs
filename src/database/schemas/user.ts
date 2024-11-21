import { type } from 'arktype';

import { arkArticleId, arkUserId } from 'src/database/schemas/ids.js';

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
  'favorites': type.Record(arkArticleId, {
    since: 'number.epoch',
  }),
  'replacedBy': arkUserId.optional(),
});

export type UserDocument = typeof arkUserDocument.infer;
