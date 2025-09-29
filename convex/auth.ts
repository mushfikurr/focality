import {
  AuthFunctions,
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireEnv } from "@convex-dev/better-auth/utils";
import { betterAuth } from "better-auth";
import { components, internal } from "./_generated/api";
import type { DataModel, Doc, Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

const authFunctions: AuthFunctions = internal.auth;

export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      onCreate: async (ctx, authUser) => {
        // Any `onCreateUser` logic should be moved here
        const userId = await ctx.db.insert("users", {
          email: authUser.email,
          name: authUser.name,
        });
        // Instead of returning the user id, we set it to the component
        // user table manually. This is no longer required behavior, but
        // is necessary when migrating from previous versions to avoid
        // a required database migration.
        // This helper method exists solely to facilitate this migration.
        await authComponent.setUserId(ctx, authUser._id, userId);
      },
      onUpdate: async (ctx, oldUser, newUser) => {
        // Any `onUpdateUser` logic should be moved here
      },
      onDelete: async (ctx, authUser) => {
        await ctx.db.delete(authUser.userId as Id<"users">);
      },
    },
  },
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

export const currentUser = async (ctx: any): Promise<Doc<"users"> | null> => {
  const userMetadata = await authComponent.safeGetAuthUser(ctx);
  if (!userMetadata) return null;
  const user = await ctx.db.get(userMetadata.userId);
  if (!user) {
    return null;
  }
  return user;
};

export const currentUserId = async (ctx: any): Promise<Id<"users"> | null> => {
  const userMetadata = await authComponent.safeGetAuthUser(ctx);
  if (!userMetadata) return null;
  return userMetadata.userId as Id<"users">;
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userMetadata = await authComponent.safeGetAuthUser(ctx);
    if (!userMetadata) return null;

    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    return user ?? null;
  },
});

const siteUrl = requireEnv("SITE_URL");

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [convex()],
    // When createAuth is called just to generate options, we don't want to
    // log anything
    logger: {
      disabled: optionsOnly,
    },
  });
};
