import { type } from 'arktype';

import { arkCommentDocument } from 'src/database/models/comments.js';
import { arkArticleId, arkCommentId } from 'src/database/models/ids.js';
import { extractUsername } from 'src/domains/authentication/utils/extractUsername.js';
import { addComment } from 'src/domains/comments/business/addComment.js';
import { deleteComment } from 'src/domains/comments/business/deleteComment.js';
import { arkApiCommentOutput } from 'src/domains/comments/schemas.js';
import { getUserProfile } from 'src/domains/profiles/business/getUserProfile.js';
import { authenticatedProcedure, router } from 'src/trpc/trpc.js';

export const commentRouter = router({
  addComment: authenticatedProcedure
    .input(type({ slug: 'string', body: arkCommentDocument.get('body') }).assert)
    .output(arkApiCommentOutput.assert)
    .mutation(async ({ input }) => {
      const articleId = arkArticleId.assert(`article__${input.slug}`);
      const comment = await addComment(articleId, input.body);
      const author = await getUserProfile(extractUsername(comment.authorId));

      return {
        ...comment,
        author,
      };
    }),

  deleteComment: authenticatedProcedure
    .input(type({ commentId: arkCommentId }).assert)
    .mutation(async ({ input }) => {
      await deleteComment(input.commentId);
    }),
});
