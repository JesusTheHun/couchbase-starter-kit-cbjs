import { type } from 'arktype';

import { arkUserId } from 'src/database/schemas/ids.js';

export const arkArticleDocument = type({
  title: 'string >= 3',
  slug: 'string <= 240',
  description: 'string >= 6',
  body: 'string >= 10',
  tagList: '(string > 0)[] ?',
  createdAt: 'number.epoch',
  updatedAt: 'number.epoch',
  favoritesCount: 'number.integer >= 0',
  replacedBy: 'string?',
  authorId: arkUserId,
});

export type ArticleDocument = typeof arkArticleDocument.infer;
