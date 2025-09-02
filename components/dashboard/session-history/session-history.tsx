"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import {
  PaginatedQueryItem,
  Preloaded,
  usePreloadedQuery,
  useQuery,
} from "convex/react";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Filter, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useSimplePaginatedQuery } from "@/lib/hooks/use-convex-tanstack-table";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { formatTimeFromMsToHHMMSS } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";
import { Id } from "@/convex/_generated/dataModel";

// Type

type Session = Awaited<
  PaginatedQueryItem<typeof api.session.queries.paginatedSessionsByCurrentUser>
>;

type SessionHistoryProps = {
  preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
};

export default function SessionHistory({ preloadedUser }: SessionHistoryProps) {
  const user = usePreloadedQuery(preloadedUser);

  if (!user) return <SessionHistorySkeleton />;

  return <SessionHistoryTable userId={user._id} />;
}

export function SessionHistorySkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-primary h-4 w-4" />
            <CardTitle className="text-base font-semibold">
              Session History
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted h-64 w-full animate-pulse rounded-lg" />
      </CardContent>
    </Card>
  );
}

type SessionHistoryTableProps = {
  userId: Id<"users">;
};

function SessionHistoryTable({ userId }: SessionHistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);

  const { status, loadNext, loadPrev, currentPageNum, currentResults } =
    useSimplePaginatedQuery(
      api.session.queries.paginatedSessionsByCurrentUser,
      { userId },
      { initialNumItems: 5 },
    );

  const navigate = useRouter();
  const handleSessionClick = (sessionId: string) => {
    navigate.push(`/session/id/${sessionId}`);
  };

  let sessions = status === "loaded" ? currentResults.page : [];

  if (searchQuery) {
    sessions = sessions.filter((s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  if (showCompletedOnly) {
    sessions = sessions.filter((s) => s.completionPercentage === 100);
  }

  const columns = useMemo<ColumnDef<Session>[]>(
    () => [
      {
        accessorKey: "date",
        header: () => "Date",
        cell: ({ row }) => (
          <span className="text-xs">
            {row.original.date && format(row.original.date, "d MMM")}
          </span>
        ),
        sortingFn: "datetime",
      },
      {
        accessorKey: "title",
        header: () => "Title",
        cell: ({ row }) => (
          <span className="text-xs font-medium">{row.original.title}</span>
        ),
      },
      {
        accessorKey: "completionPercentage",
        header: () => "Completion",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-xs">
            <div className="bg-muted h-2 w-16">
              <div
                className="bg-primary h-2"
                style={{ width: `${row.original.completionPercentage}%` }}
              />
            </div>
            <span>{Math.floor(row.original.completionPercentage)}%</span>
          </div>
        ),
        sortingFn: "basic",
      },
      {
        accessorKey: "time.focusedTime",
        header: () => "Focused Time",
        cell: ({ row }) => (
          <span className="text-primary w-full text-right text-xs">
            {formatTimeFromMsToHHMMSS(row.original.time.focusedTime)}
          </span>
        ),
        sortingFn: (rowA, rowB, columnId) => {
          return (
            rowA.original.time.focusedTime - rowB.original.time.focusedTime
          );
        },
      },
      {
        accessorKey: "xpGained",
        header: () => "XP Gained",
        cell: ({ row }) => (
          <span className="text-primary text-xs">
            +{row.original.xpGained} XP
          </span>
        ),
        sortingFn: "basic",
      },
      {
        id: "action",
        accessorKey: "id",
        header: "",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            onClick={() => handleSessionClick(row.original.id)}
            size="icon"
            className="h-6 w-6"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [navigate],
  );

  const table = useReactTable({
    data: sessions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: -1,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-primary h-4 w-4" />
            <CardTitle className="text-base font-semibold">
              Session History
            </CardTitle>
          </div>
          {status === "loaded" && !!sessions.length && (
            <SearchAndFilter
              showCompletedOnly={showCompletedOnly}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setShowCompletedOnly={setShowCompletedOnly}
              disabled={status !== "loaded"}
            />
          )}
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="hover:bg-muted/60 focus:bg-muted/80 cursor-pointer rounded-sm text-xs font-medium transition-colors select-none"
                      onClick={header.column.getToggleSortingHandler()}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          header.column.toggleSorting();
                        }
                      }}
                      aria-sort={
                        header.column.getIsSorted() === "asc"
                          ? "ascending"
                          : header.column.getIsSorted() === "desc"
                            ? "descending"
                            : "none"
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getIsSorted() === "asc" && " ↑"}
                      {header.column.getIsSorted() === "desc" && " ↓"}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {status === "loading" && (
                <SessionHistoryTableSkeleton numRows={1} />
              )}
              {status === "loaded" && !!!table.getRowModel().rows.length && (
                <TableRow className="text-muted-foreground p-3 px-2">
                  <TableCell colSpan={columns.length} className="text-center">
                    No sessions to view.
                  </TableCell>
                </TableRow>
              )}
              {status === "loaded" &&
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 text-xs">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            Page {currentPageNum}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => loadPrev?.()}
              disabled={!loadPrev || status === "loading"}
            >
              Prev
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => loadNext?.()}
              disabled={!loadNext || status === "loading"}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SessionHistoryTableSkeleton({ numRows }: { numRows: number }) {
  return (
    <>
      {Array.from({ length: numRows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

type SearchAndFilterProps = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  showCompletedOnly: boolean;
  setShowCompletedOnly: React.Dispatch<React.SetStateAction<boolean>>;
};

function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  showCompletedOnly,
  setShowCompletedOnly,
  disabled,
}: SearchAndFilterProps & { disabled: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search sessions..."
          className="h-8 w-full max-w-xs py-1 pr-2 pl-8 text-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={disabled}
        />
        <Search className="text-muted-foreground absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2 transform" />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex h-8 items-center gap-1 text-xs"
            disabled={disabled}
          >
            <Filter className="h-3 w-3" />
            <span>Filter</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="completedOnly"
              checked={showCompletedOnly}
              onCheckedChange={() => setShowCompletedOnly((prev) => !prev)}
              disabled={disabled}
            />
            <label htmlFor="completedOnly" className="text-xs">
              Completed only
            </label>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
