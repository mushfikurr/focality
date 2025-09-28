import { preloadQuery } from "convex/nextjs";
import { FunctionReference } from "convex/server";
import { getToken } from "./data/server/token";

export async function preloadWithAuth(
  queryFn: FunctionReference<"query">,
  args: any = {},
) {
  const token = await getToken();
  return preloadQuery(queryFn, args, { token });
}
