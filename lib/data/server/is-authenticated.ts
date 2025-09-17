import "server-only";

import { createAuth } from "@/lib/auth";
import { getToken } from "@convex-dev/better-auth/nextjs";
import { redirect } from "next/navigation";

export default async function redirectIfNotAuthenticated() {
  const token = await getToken(createAuth);
  if (!token) redirect("/login");
}
