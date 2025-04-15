"use client";

import { Authenticated } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Scroller } from "../ui/scroller";

export default function Stats() {
  return (
    <Authenticated>
      <AuthenticatedStats />
    </Authenticated>
  );
}

function AuthenticatedStats() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <Scroller className="h-full max-h-full overflow-auto text-sm">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span>Today's Focus Time</span>
              <span className="font-medium">1h 15m</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Current Streak</span>
              <span className="font-medium text-[#D6A45D]">5 days</span>
            </div>

            <div className="flex items-center justify-between">
              <span>XP Earned Today</span>
              <span className="font-medium text-[#D6A45D]">+150 XP</span>
            </div>
          </div>
        </Scroller>
      </CardContent>
    </Card>
  );
}
