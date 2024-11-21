import { ArticleId } from 'src/database/schemas/ids.js';
import { ApiArticleUpdateInput } from 'src/domains/articles/schemas.js';
import { createSlug } from 'src/domains/articles/utils/createSlug.js';
import { ForbiddenError } from 'src/errors/ForbiddenError.js';
import { getRequestContext } from 'src/trpc/requestALS.js';

export async function updateArticle(
  articleId: ArticleId,
  data: ApiArticleUpdateInput['article']
): Promise<ArticleId> {
  const { userId, cb } = getRequestContext();

  const {
    content: [{ value: authorId }, { value: currentTitle }],
  } = await cb.collection('articles').lookupIn(articleId).get('authorId').get('title');

  if (userId != authorId) {
    throw new ForbiddenError();
  }

  const mutations = cb
    .collection('articles')
    .mutateIn(articleId)
    .replace('updatedAt', Date.now());

  if (data.body) {
    mutations.replace('body', data.body);
  }

  if (data.description) {
    mutations.replace('description', data.description);
  }

  if (!data.title || data.title === currentTitle) {
    await mutations;
    return articleId;
  }

  // If we reach this point, it's because the title has changed
  // We need to change the document key ; the only way to do that is to insert a new doc and remove the old one

  const newSlug = createSlug(data.title);
  const newArticleId: ArticleId = `article__${newSlug}`;

  // We set this property so in the event of an app crash between deletion and creation,
  // we can still reconcile the state of data

  mutations.insert('replacedBy', newArticleId);
  await mutations;

  const { content: doc } = await cb.collection('articles').get(articleId);
  const { replacedBy, ...rest } = doc;

  await cb.collection('articles').insert(newArticleId, {
    ...rest,
    title: data.title,
    slug: newSlug,
  });

  await cb.collection('articles').remove(articleId);

  return newArticleId;
}
