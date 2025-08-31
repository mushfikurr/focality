'use client';

import { LucideIcon } from "lucide-react";

interface PatternCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
}

export default function PatternCard({ title, icon: Icon, description }: PatternCardProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-sm font-medium">{description}</p>
      </div>
    </div>
  );
}
