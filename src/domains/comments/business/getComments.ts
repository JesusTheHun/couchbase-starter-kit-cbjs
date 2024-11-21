import { ArticleId } from 'src/database/schemas/ids.js';
import { getUnauthenticatedRequestContext } from 'src/trpc/requestALS.js';

export async function getComments(articleId: ArticleId) {
  const { cb } = getUnauthenticatedRequestContext();

  const result = await cb.query(
    `
    SELECT META(comments).id AS id, * FROM comments
    LEFT JOIN users AS author ON KEYS comments.authorId 
    WHERE comments.articleId = $1
    ORDER BY comments.createdAt ASC
  `,
    { parameters: [articleId] }
  );

  return result.rows.map((row) => {
    return {
      id: row.id,
      ...row.comments,
      author: row.author,
    };
  });
}
