import { SessionCardSkeleton } from "./session-list";

function SessionListSkeleton() {
  return Array.from({ length: 3 }).map((_, i) => (
    <SessionCardSkeleton key={i} />
  ));
}

export default SessionListSkeleton;
