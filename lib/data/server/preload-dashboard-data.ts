"server-only";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { preloadWithAuth } from "../../preload-with-auth";
import { getToken } from "./token";

export async function preloadDashboardData() {
  const token = await getToken();
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
