import { ArticleDocument } from 'src/database/models/article.js';
import { ApiArticleCriteria } from 'src/domains/articles/schemas.js';
import { getRequestContext } from 'src/trpc/requestALS.js';

export async function queryArticles(
  criteria: ApiArticleCriteria
): Promise<ArticleDocument[]> {
  const { cb } = getRequestContext();

  const where: string[] = [];
  const parameters: Record<string, string | number> = {};
  let letClause = '';

  if (criteria.author) {
    where.push('author = $author');
    parameters['author'] = criteria.author;
  }

  if (criteria.tag) {
    where.push('$1 IN tagList');
    parameters['tag'] = criteria.tag;
  }

  if (criteria.favorited) {
    letClause = `LET favorites = SELECT RAW OBJECT_NAMES(favorites) FROM users USE KEY $favorited`;
    parameters['favorited'] = criteria.favorited;
    where.push('META().id IN favorites');
  }

  const pagination = `LIMIT ${criteria.limit ?? 20} OFFSET ${criteria.offset ?? 0}`;

  const whereClause = where.join(' AND ');

  const query = `
  ${letClause}
  SELECT * FROM article
  LEFT JOIN users AS author ON META(author).id = article.author`;
  `
  ${whereClause}
  SORT BY createdAt DESC
  ${pagination}
  `;

  const result = await cb.query(query, { parameters });

  return result.rows;
}
