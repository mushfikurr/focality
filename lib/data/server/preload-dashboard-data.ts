"server-only";

import { api } from "@/convex/_generated/api";
import { preloadWithAuth } from "../../preload-with-auth";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "./token";
import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

export async function preloadDashboardData() {
  const token = await getToken();
  if (!token) redirect("/");
  return await preloadQuery(
    api.dashboard.queries.getDashboardData,
    {},
    { token },
  );
}

export async function preloadPaginatedSessions(userId: Id<"users">) {
  return await preloadWithAuth(
    api.session.queries.paginatedSessionsByCurrentUser,
    { userId },
  );
}
