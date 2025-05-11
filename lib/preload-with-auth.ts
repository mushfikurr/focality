import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { FunctionReference } from "convex/server";

export async function preloadWithAuth(
  queryFn: FunctionReference<"query">,
  args: any = {},
) {
  const token = await convexAuthNextjsToken();
  return preloadQuery(queryFn, args, { token });
}
