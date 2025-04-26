import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

type StatisticCardProps = {
  className?: string;
  Icon: LucideIcon;
  cardTitle: string;
  statHeading: string;
  statSubheading?: string;
};

export function StatisticCard({ ...props }: StatisticCardProps) {
  const { className, Icon, cardTitle, statHeading, statSubheading } = props;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="text-primary h-4 w-4" />
          <CardTitle className="text-sm font-medium">{cardTitle}</CardTitle>
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
