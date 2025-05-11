"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Award, Clock, Flame, Target } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { AchievementType } from "@/convex/schema";

interface AchievementsProps {
  preloadedAchievements: Preloaded<typeof api.achievements.queries.getAchievementsForCurrentUser>
}

export default function Achievements({ preloadedAchievements }: AchievementsProps) {
  const achievements = usePreloadedQuery(preloadedAchievements);
  if (!achievements) return <EmptyAchievements />

  return (
    <Card className="mb-8 h-fit">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Target className="text-primary h-4 w-4" />
          <CardTitle className="text-base font-semibold">
            Recent Achievements
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 h-fit">
          {achievements
            .filter((a): a is Doc<"achievementDefinitions"> => a !== null)
            .map((a) => <AchievementCard key={a._id} {...a} />)}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyAchievements() {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div>
          <h3 className="text-sm font-medium"></h3>
          <p className="text-muted-foreground text-xs">
            Earned 4,000+ experience points
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function renderAchievementType(type: AchievementType) {
  const badgeClasses = "text-primary h-5 w-5"

  switch (type) {
    case "level":
      return <Award className={badgeClasses} />
    default:
      return <Award className={badgeClasses} />
  }
}

function AchievementCard(achievement: Doc<"achievementDefinitions">) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-0 px-4">
        <div className="bg-muted flex h-10 w-10 items-center justify-center">
          {renderAchievementType(achievement.type)}
        </div>
        <div>
          <h3 className="text-sm font-medium">{achievement.title}</h3>
          <p className="text-muted-foreground text-xs">
            {achievement.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
