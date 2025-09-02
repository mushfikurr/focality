import {
  BetterAuth,
  type AuthFunctions,
  type PublicAuthFunctions,
} from "@convex-dev/better-auth";
import { api, components, internal } from "./_generated/api";
import type { DataModel, Doc, Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

const authFunctions: AuthFunctions = internal.auth;
const publicAuthFunctions: PublicAuthFunctions = api.auth;

export const betterAuthComponent = new BetterAuth(components.betterAuth, {
  authFunctions,
  publicAuthFunctions,
});

export const {
  createUser,
  updateUser,
  deleteUser,
  createSession,
  isAuthenticated,
} = betterAuthComponent.createAuthFunctions<DataModel>({
  onCreateUser: async (ctx, user) => {
    return ctx.db.insert("users", {
      email: user.email,
      name: user.name,
    });
  },

  onDeleteUser: async (ctx, userId) => {
    await ctx.db.delete(userId as Id<"users">);
  },
});

export const currentUser = async (ctx: any): Promise<Doc<"users"> | null> => {
  if (!isAuthenticated) {
    throw new Error("Not authenticated");
  }
  const userMetadata = await betterAuthComponent.getAuthUser(ctx);
  if (!userMetadata) {
    throw new Error("User doesnt exist");
  }
  return ctx.db.get(userMetadata.userId as Id<"users">);
};

export const currentUserId = async (ctx: any): Promise<Id<"users">> => {
  const userId = (await betterAuthComponent.getAuthUserId(ctx)) as Id<"users">;
  if (!userId) {
    throw new Error("User doesnt exist");
  }
  return userId;
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => await currentUser(ctx),
});
