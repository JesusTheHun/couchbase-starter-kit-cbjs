import { type } from 'arktype';

import { arkCommentDocument } from 'src/database/schemas/comment.js';
import { arkArticleId, arkCommentId } from 'src/database/schemas/ids.js';
import { extractUsername } from 'src/domains/authentication/utils/extractUsername.js';
import { addComment } from 'src/domains/comments/business/addComment.js';
import { deleteComment } from 'src/domains/comments/business/deleteComment.js';
import { getComments } from 'src/domains/comments/business/getComments.js';
import { arkApiCommentOutput } from 'src/domains/comments/schemas.js';
import { getUserProfile } from 'src/domains/profiles/business/getUserProfile.js';
import { authenticatedProcedure, publicProcedure, router } from 'src/trpc/trpc.js';

export const commentsRouter = router({
  addComment: authenticatedProcedure
    .input(type({ slug: 'string', comment: arkCommentDocument.pick('body') }).assert)
    .output(arkApiCommentOutput.assert)
    .mutation(async ({ input }) => {
      const articleId = arkArticleId.assert(`article__${input.slug}`);
      const comment = await addComment(articleId, input.comment.body);
      const author = await getUserProfile(extractUsername(comment.authorId));

      return {
        comment: {
          ...comment,
          author,
        },
      };
    }),

  deleteComment: authenticatedProcedure
    .input(type({ commentId: arkCommentId }).assert)
    .mutation(async ({ input }) => {
      await deleteComment(input.commentId);
    }),

  getComments: publicProcedure
    .input(type({ slug: 'string' }).assert)
    .output(
      type({
        comments: arkApiCommentOutput.get('comment').array(),
      })
    )
    .query(async ({ input }) => {
      const articleId = arkArticleId.assert(`article__${input.slug}`);
      const comments = await getComments(articleId);

      return { comments };
    }),
});
