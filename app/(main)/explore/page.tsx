import SessionList from "@/components/explore/session-list";
import redirectIfNotAuthenticated from "@/lib/data/server/is-authenticated";

export default async function ExplorePage() {
  await redirectIfNotAuthenticated();

  return (
    <div className="container mx-auto">
      <div className="space-y-1 py-8 pt-3">
        <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
        <p className="text-muted-foreground">
          Stay on track with group focus sessions
        </p>
      </div>
      <SessionList />
    </div>
  );
}
