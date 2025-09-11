"use client";

import { LucideIcon } from "lucide-react";

interface PatternCardProps {
  title: string;
  icon: LucideIcon;
  description: React.ReactNode;
}

export default function PatternCard({
  title,
  icon: Icon,
  description,
}: PatternCardProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
        <Icon className="text-primary h-5 w-5" />
      </div>
      <div>
        <p className="text-muted-foreground text-xs">{title}</p>
        <p className="text-sm font-medium">{description}</p>
      </div>
    </div>
  );
}
