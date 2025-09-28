import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { getToken } from "./token";

export const preloadUser = async () => {
  await getToken();
  return await preloadQuery(api.auth.getCurrentUser);
};
