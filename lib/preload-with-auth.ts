import { preloadQuery } from "convex/nextjs";
import { FunctionReference } from "convex/server";
import { getToken } from "./data/server/token";

export async function preloadWithAuth(
  queryFn: FunctionReference<"query">,
  args: Record<string, unknown> = {},
) {
  const token = await getToken();
  return preloadQuery(queryFn, args, { token });
}
