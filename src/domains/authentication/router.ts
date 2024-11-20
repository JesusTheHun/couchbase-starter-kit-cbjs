import { authenticateUser } from 'src/domains/authentication/business/authenticateUser.js';
import { registerUser } from 'src/domains/authentication/business/registerUser.js';
import { updateUser } from 'src/domains/authentication/business/updateUser.js';
import {
  arkApiUserAuthenticationOutput,
  arkApiUserLoginInput,
  arkApiUserRegistrationInput,
  arkApiUserUpdateInput,
} from 'src/domains/authentication/schemas.js';
import { authenticatedProcedure, publicProcedure, router } from 'src/trpc/trpc.js';

export const authenticationRouter = router({
  register: publicProcedure
    .input(arkApiUserRegistrationInput.assert)
    .output(arkApiUserAuthenticationOutput.assert)
    .mutation(async ({ input }) => {
      const result = await registerUser(input);

      return {
        user: result,
      };
    }),
  login: publicProcedure
    .input(arkApiUserLoginInput.assert)
    .output(arkApiUserAuthenticationOutput.assert)
    .mutation(async ({ input }) => {
      const result = await authenticateUser(input.user.email, input.user.password);

      return {
        user: result,
      };
    }),

  updateUser: authenticatedProcedure
    .input(arkApiUserUpdateInput.assert)
    .output(arkApiUserAuthenticationOutput.assert)
    .mutation(async ({ input }) => {
      const result = await updateUser(input.user);

      return {
        user: result,
      };
    }),
});
