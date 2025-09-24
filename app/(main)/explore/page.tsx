import SessionList from "@/components/explore/session-list";

export default async function ExplorePage() {
  return (
    <div className="flex h-full flex-col">
      <div className="container mx-auto flex-shrink-0 pt-4">
        <div className="mb-4">
          <h1 className="mb-1 text-2xl font-semibold">Explore</h1>
          <p className="text-muted-foreground text-sm">
            Stay on track with group focus sessions
          </p>
        </div>
      </div>
      <div className="flex-1">
        <div className="container mx-auto h-full">
          <SessionList />
        </div>
      </div>
    </div>
  );
}
