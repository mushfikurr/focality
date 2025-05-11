import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type StatisticCardProps = {
  className?: string;
  Icon: LucideIcon;
  cardTitle: React.ReactNode;
  statHeading: string;
  statSubheading?: React.ReactNode;
};

export function StatisticCard({ ...props }: StatisticCardProps) {
  const { className, Icon, cardTitle, statHeading, statSubheading } = props;

  return (
    <Card className={cn(className)}>
      <CardHeader className="w-full">
        <div className="flex items-center gap-2">
          <Icon className="text-primary h-4 w-4" />
          <CardTitle className="w-full text-sm font-medium">
            {cardTitle}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{statHeading}</p>
        {statSubheading && (
          <p className="text-muted-foreground mt-1 text-xs">{statSubheading}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function StatisticCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-20" />
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="mt-1 h-3 w-16" />
      </CardContent>
    </Card>
  );
}
