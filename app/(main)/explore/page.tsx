import SessionList from "@/components/explore/session-list";
import { getToken } from "@/lib/data/server/token";

export default async function ExplorePage() {
  await getToken();
  return <SessionList />;
}
