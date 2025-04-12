import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { TaskItemSkeleton } from "./task-item";

export function TasksSkeleton() {
  return (
    <Card className="max-h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-32" />
          <Button className="-mr-2 text-xs" variant="ghost" size="sm" disabled>
            <Plus className="mr-2" /> <Skeleton className="h-4 w-16" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-full overflow-auto">
        <ScrollArea className="max-h-full overflow-auto">
          {Array.from({ length: 2 }).map((_, index) => (
            <TaskItemSkeleton key={index} />
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="text-xs">
        <div className="text-muted-foreground flex h-full gap-3">
          <div className="flex h-full items-center gap-3 border-r pr-3">
            <Skeleton className="bg-primary mt-0.5 aspect-square h-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </CardFooter>
    </Card>
  );
}
