import { preloadWithAuth } from "../preload-with-auth";
import { api } from "@/convex/_generated/api";

export async function preloadDashboard() {
  const preloadedTaskStatistics = await preloadWithAuth(
    api.statistics.tasks.queries.getTaskStatisticsForCurrentUser,
  );
  const preloadedSessionStatistics = await preloadWithAuth(
    api.statistics.sessions.queries.getSessionStatisticsForCurrentUser,
  );
  const preloadedStreakInfo = await preloadWithAuth(
    api.streaks.queries.getStreakInfoByCurrentUser,
  );
  const preloadedLevelInfo = await preloadWithAuth(
    api.levels.queries.getLevelInfo,
  );
  const preloadedAchievements = await preloadWithAuth(
    api.achievements.queries.getAchievementsForCurrentUser,
  );

  return {
    preloadedTaskStatistics,
    preloadedSessionStatistics,
    preloadedStreakInfo,
    preloadedLevelInfo,
    preloadedAchievements,
  };
}
