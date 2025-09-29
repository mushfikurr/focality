import SessionList from "@/components/explore/session-list";
import { getToken } from "@/lib/data/server/token";
import { redirect } from "next/navigation";

export default async function ExplorePage() {
  const token = await getToken();
  if (!token) {
    redirect("/");
  }

  return <SessionList />;
}
