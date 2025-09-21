"server-only";

import { api } from "@/convex/_generated/api";
import { preloadWithAuth } from "../../preload-with-auth";
import { Id } from "@/convex/_generated/dataModel";

export async function preloadDashboardData() {
  return await preloadWithAuth(api.dashboard.queries.getDashboardData);
}

export async function preloadPaginatedSessions(userId: Id<"users">) {
  return await preloadWithAuth(
    api.session.queries.paginatedSessionsByCurrentUser,
    { userId },
  );
}
