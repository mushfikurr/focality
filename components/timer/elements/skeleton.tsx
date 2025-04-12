import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

export function SessionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col items-center justify-center gap-8 py-6">
          <div className="text-center">
            <Skeleton className="mb-2 h-16 w-48" />
            <Skeleton className="mx-auto h-4 w-24" />
          </div>
          <div className="flex gap-3">
            <Button disabled>
              <Skeleton className="h-4 w-14" />
            </Button>
            <Button variant="outline" disabled>
              <Skeleton className="h-4 w-14" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col gap-3 text-xs">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-3 w-full" />
          <div className="flex justify-between gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
