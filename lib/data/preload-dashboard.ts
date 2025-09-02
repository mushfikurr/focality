import { preloadWithAuth } from "../preload-with-auth";
import { api } from "@/convex/_generated/api";

export async function preloadDashboard() {
  const [
    preloadedTaskStatistics,
    preloadedSessionStatistics,
    preloadedStreakInfo,
    preloadedLevelInfo,
    preloadedAchievements,
    preloadedCurrentUser,
  ] = await Promise.all([
    preloadWithAuth(
      api.statistics.tasks.queries.getTaskStatisticsForCurrentUser,
    ),
    preloadWithAuth(
      api.statistics.sessions.queries.getSessionStatisticsForCurrentUser,
    ),
    preloadWithAuth(api.streaks.queries.getStreakInfoByCurrentUser),
    preloadWithAuth(api.levels.queries.getLevelInfo),
    preloadWithAuth(api.achievements.queries.getAchievementsForCurrentUser),
    preloadWithAuth(api.auth.getCurrentUser),
  ]);

  return {
    preloadedTaskStatistics,
    preloadedSessionStatistics,
    preloadedStreakInfo,
    preloadedLevelInfo,
    preloadedAchievements,
    preloadedCurrentUser,
  };
}
