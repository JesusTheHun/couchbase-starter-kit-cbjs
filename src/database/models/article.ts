import { type } from 'arktype';

import { arkUserId } from 'src/database/models/ids.js';

export const arkArticleDocument = type({
  title: 'string >= 6',
  description: 'string >= 6',
  body: 'string > 50',
  tagList: '(string > 0)[]',
  createdAt: 'number.epoch',
  updatedAt: 'number.epoch',
  favoritesCount: 'number',
  author: arkUserId,
});

export type ArticleDocument = typeof arkArticleDocument.infer;
