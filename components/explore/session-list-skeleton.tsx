import { SessionCardSkeleton } from "./session-list";
import { Skeleton } from "../ui/skeleton";
import { Search } from "lucide-react";

function SessionListSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* Search input skeleton */}
      <div className="bg-background sticky top-0 z-10 py-2">
        <div className="flex items-center gap-2">
          <Search className="text-muted-foreground mr-2 h-4 w-4" />
          <Skeleton className="h-8 w-full max-w-xs" />
        </div>
      </div>

      {/* Session cards skeleton */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SessionListSkeleton;
