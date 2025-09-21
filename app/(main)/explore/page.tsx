import SessionList from "@/components/explore/session-list";
import redirectIfNotAuthenticated from "@/lib/data/server/is-authenticated";

export default async function ExplorePage() {
  await redirectIfNotAuthenticated();

  return (
    <div className="flex h-full flex-col">
      <div className="container mx-auto flex-shrink-0">
        <div className="space-y-1 py-8 pt-3 pb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
          <p className="text-muted-foreground">
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
