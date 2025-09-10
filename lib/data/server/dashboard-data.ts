"use server";

import { api } from "@/convex/_generated/api";
import { preloadWithAuth } from "../../preload-with-auth";
import { Id } from "@/convex/_generated/dataModel";

export async function preloadDashboardData() {
  const preloadedTasks = await preloadWithAuth(
    api.statistics.tasks.queries.getTaskStatisticsForCurrentUser,
  );
  const preloadedSessions = await preloadWithAuth(
    api.statistics.sessions.queries.getSessionStatisticsForCurrentUser,
  );
  const preloadedStreak = await preloadWithAuth(
    api.streaks.queries.getStreakInfoByCurrentUser,
  );
  const preloadedLevel = await preloadWithAuth(api.levels.queries.getLevelInfo);
  const preloadedAchievements = await preloadWithAuth(
    api.achievements.queries.getAchievementsForCurrentUser,
  );
  const preloadedUser = await preloadWithAuth(api.auth.getCurrentUser);

  return {
    preloadedTasks,
    preloadedSessions,
    preloadedStreak,
    preloadedLevel,
    preloadedAchievements,
    preloadedUser,
  };
}

export async function preloadPaginatedSessions(userId: Id<"users">) {
  return await preloadWithAuth(
    api.session.queries.paginatedSessionsByCurrentUser,
    { userId },
  );
}