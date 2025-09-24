import SessionListSkeleton from "@/components/explore/session-list-skeleton";

export default function ExploreLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-3 lg:grid-cols-4">
      <SessionListSkeleton />
    </div>
  );
}
