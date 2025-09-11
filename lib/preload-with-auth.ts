import { getToken } from "@convex-dev/better-auth/nextjs";
import { preloadQuery } from "convex/nextjs";
import { FunctionReference } from "convex/server";
import { createAuth } from "./auth";

export async function preloadWithAuth(
  queryFn: FunctionReference<"query">,
  authToken?: string,
  args: any = {},
) {
  const token = authToken ?? (await getToken(createAuth));
  return preloadQuery(queryFn, args, { token });
}
