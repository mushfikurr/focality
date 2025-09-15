import { getToken } from "@convex-dev/better-auth/nextjs";
import { preloadQuery } from "convex/nextjs";
import { FunctionReference } from "convex/server";
import { createAuth } from "./auth";

export async function preloadWithAuth(
  queryFn: FunctionReference<"query">,
  args: any = {},
) {
  const token = await getToken(createAuth);
  return preloadQuery(queryFn, args, { token });
}
