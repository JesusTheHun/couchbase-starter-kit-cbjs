import { ArticleId } from 'src/database/models/ids.js';
import { getUnauthenticatedRequestContext } from 'src/trpc/requestALS.js';

export async function getComments(articleId: ArticleId) {
  const { cb } = getUnauthenticatedRequestContext();

  const result = await cb.query(
    `
    SELECT * FROM comments
    LEFT JOIN users AS author ON KEYS comment.authorId 
    WHERE articleId = $1
    ORDER BY createdAt ASC
  `,
    { parameters: [articleId] }
  );

  return result.rows.map((row) => {
    return {
      ...row.comments,
      author: row.author,
    };
  });
}
