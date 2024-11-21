import { arkArticleDocument, ArticleDocument } from 'src/database/schemas/article.js';
import { arkArticleId } from 'src/database/schemas/ids.js';
import { ApiArticleCreateInput } from 'src/domains/articles/schemas.js';
import { createSlug } from 'src/domains/articles/utils/createSlug.js';
import { getRequestContext } from 'src/trpc/requestALS.js';

export async function createArticle(
  data: ApiArticleCreateInput['article']
): Promise<ArticleDocument> {
  const { userId, cb } = getRequestContext();
  const now = Date.now();

  const slug = createSlug(data.title);
  const articleId = arkArticleId.assert(`article__${slug}`);
  const articleDocument = {
    ...data,
    slug,
    favoritesCount: 0,
    authorId: userId,
    createdAt: now,
    updatedAt: now,
  } satisfies ArticleDocument;

  await cb
    .collection('articles')
    .insert(articleId, arkArticleDocument.assert(articleDocument));

  return articleDocument;
}
