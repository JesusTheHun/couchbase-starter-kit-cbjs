import { type } from 'arktype';

import { arkArticleDocument } from 'src/database/models/article.js';
import { arkUserId } from 'src/database/models/ids.js';
import { arkApiUserProfileOutput } from 'src/domains/profiles/schemas.js';
import { epochToIso } from 'src/utils/epochToIso.js';

export const arkApiArticleCriteria = type({
  'tag?': 'undefined | string',
  'author?': 'undefined | string', // we'll receive the username, not the userId
  'favorited?': arkUserId.or('undefined'),
  'limit?': type.number.default(20).atMost(200), // we set an upper bound, be reasonable !
  'offset?': type.number.default(0).atLeast(0),
});

export const arkApiArticleCreateInput = type({
  article: arkArticleDocument.pick('title', 'body', 'description', 'tagList'),
});

export const arkApiArticleUpdateInput = type({
  slug: 'string',
  article: arkApiArticleCreateInput.get('article').partial().omit('tagList'),
});

export const arkApiGetArticleOutput = type({
  article: arkArticleDocument
    .pick('title', 'slug', 'body', 'description', 'tagList', 'favoritesCount')
    .merge({
      createdAt: type.number.pipe(epochToIso),
      updatedAt: type.number.pipe(epochToIso),
      favorited: 'boolean?',
      author: arkApiUserProfileOutput.get('profile'),
    })
    .onDeepUndeclaredKey('delete'),
});

export const arkApiGetArticlesOutput = type({
  articles: arkApiGetArticleOutput.get('article').array(),
});

export type ApiArticleCriteria = typeof arkApiArticleCriteria.infer;
export type ApiArticleCreateInput = typeof arkApiArticleCreateInput.infer;
export type ApiArticleUpdateInput = typeof arkApiArticleUpdateInput.infer;
export type ApiGetArticleOutput = typeof arkApiGetArticleOutput.infer;
export type ApiGetArticlesOutput = typeof arkApiGetArticlesOutput.infer;
