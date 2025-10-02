"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import type { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import type { AchievementType } from "@/convex/schema";
import { Award, Target, Trophy } from "lucide-react";

type AchievementsProps = {
  achievements: NonNullable<
    (typeof api.dashboard.queries.getDashboardData)["_returnType"]
  >["achievements"];
};

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <TooltipProvider>
      <Card className="h-full min-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="text-primary h-4 w-4" />
            <CardTitle className="w-full text-base font-semibold">
              Recent Achievements
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {!achievements?.length ? (
            <p className="text-muted-foreground">
              No achievements earned yet. Get focusing!
            </p>
          ) : (
            <div className="flex h-fit flex-wrap gap-3">
              {achievements
                ?.filter((a): a is Doc<"achievementDefinitions"> => a !== null)
                .map((a) => (
                  <AchievementCard key={a._id} {...a} />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

function renderAchievementType(type: AchievementType) {
  const badgeClasses = "text-green-50 drop-shadow-sm h-5 w-5";

  switch (type) {
    case "level":
      return <Trophy className={badgeClasses} />;
    default:
      return <Trophy className={badgeClasses} />;
  }
}

function AchievementCard(achievement: Doc<"achievementDefinitions">) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex flex-col items-center gap-2">
          <div className="group relative flex w-fit items-center justify-center overflow-hidden rounded-full border border-green-200/10 bg-gradient-to-br from-green-500 to-green-300 p-3 transition-transform duration-300 hover:scale-110">
            {renderAchievementType(achievement.type)}
            {/* Shine effect overlay with skew for diagonal sweep */}
            <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-500 ease-in group-hover:translate-x-full" />
          </div>
          <h1 className="text-muted-foreground text-center text-xs">
            {achievement.title}
          </h1>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{achievement.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
