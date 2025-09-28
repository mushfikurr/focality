import { createAuth } from "@/convex/auth";
import { getToken as getTokenNextjs } from "@convex-dev/better-auth/nextjs";
import { getStaticAuth } from "@convex-dev/better-auth";

export const getToken = async () => {
  getStaticAuth(createAuth);
  return await getTokenNextjs(createAuth);
};
