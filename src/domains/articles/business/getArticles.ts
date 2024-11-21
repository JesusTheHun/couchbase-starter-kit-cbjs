import { ApiArticleCriteria } from 'src/domains/articles/schemas.js';
import { getUnauthenticatedRequestContext } from 'src/trpc/requestALS.js';

export async function getArticles(criteria: ApiArticleCriteria) {
  const { cb } = getUnauthenticatedRequestContext();

  const where: string[] = ['articles.authorId IS NOT MISSING'];
  const parameters: Record<string, string | number> = {};
  let letClause = '';

  if (criteria.author) {
    where.push('articles.authorId = $authorId');
    parameters['authorId'] = `user__${criteria.author}`;
  }

  if (criteria.tag) {
    where.push('$tag IN articles.tagList');
    parameters['tag'] = criteria.tag;
  }

  if (criteria.favorited) {
    letClause = `LET favorites = (SELECT RAW OBJECT_NAMES(users.favorites) FROM users USE KEYS $favorited)[0]`;
    parameters['favorited'] = criteria.favorited;
    where.push('META(articles).id IN favorites');
  }

  const pagination = `LIMIT ${criteria.limit ?? 20} OFFSET ${criteria.offset ?? 0}`;

  const whereClause = where.join(' AND ');

  const query = `
  SELECT * FROM articles
  LEFT JOIN users AS author ON KEYS articles.authorId
  ${letClause}
  WHERE ${whereClause}
  ORDER BY articles.createdAt DESC
  ${pagination}
  `;

  const result = await cb.query(query, { parameters });

  return result.rows.map((row) => {
    return {
      ...row.articles,
      author: row.author,
    };
  });
}
