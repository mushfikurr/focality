import redirectIfNotAuthenticated from "@/lib/data/server/is-authenticated";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await redirectIfNotAuthenticated();

  const { id } = await params;
  return <div>My Post: {id}</div>;
}
