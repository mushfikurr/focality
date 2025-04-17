import Google from "@auth/core/providers/google";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { MutationCtx } from "./_generated/server";
import { getDocumentOrThrow } from "./utils/db";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Google, Anonymous],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx: MutationCtx, { userId }) {
      const user = await getDocumentOrThrow(ctx, "users", userId);
      if (user.isAnonymous) {
        await ctx.db.patch(userId, {
          name: "Guest",
        });
      }
    },
  },
});
