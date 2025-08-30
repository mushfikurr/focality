"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Timer() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdayToday = daysOfWeek[new Date().getDay()];

  const now = new Date();
  const hours = now.getHours();
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  return (
    <div className="bg-card mb-8 w-full border p-6 shadow-xs">
      <div className="mb-3 flex items-center justify-between gap-6">
        <h2 className="text-base font-semibold">
          {weekdayToday}, {formattedHours} {amPm}
        </h2>
        <span className="text-primary flex items-center gap-2.5 text-sm font-medium">
          <span className={cn(`bg-primary h-2 w-2`)}></span>
          <p className={cn("mb-[2px]")}>Working</p>
        </span>
      </div>
      <div className="bg-muted mb-2 h-3 w-full overflow-clip border">
        <div className="bg-primary h-full w-[32%]"></div>
      </div>
      <div className="text-muted-foreground flex justify-between text-xs">
        <span>8:32 remaining</span>
        <span>32%</span>
      </div>

      <div className="mt-4 flex w-full flex-wrap justify-end gap-2">
        <Avatar className="outline-primary h-6 w-6 outline-1">
          <AvatarImage
            fetchPriority="high"
            src="https://picsum.photos/seed/avatar1/200"
          />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar className="outline-primary h-6 w-6 outline-1">
          <AvatarImage src="https://picsum.photos/seed/avatar2/200"></AvatarImage>
          <AvatarFallback>E</AvatarFallback>
        </Avatar>
        <Avatar className="outline-primary h-6 w-6 outline-1">
          <AvatarImage src="https://picsum.photos/seed/avatar3/200"></AvatarImage>
          <AvatarFallback>I</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
