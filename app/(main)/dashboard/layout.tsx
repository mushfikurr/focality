import { api } from "@/convex/_generated/api";
import { createAuth } from "@/lib/auth";
import { getToken } from "@convex-dev/better-auth/nextjs";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const token = await getToken(createAuth);
  const isAuthed = await fetchQuery(api.auth.isAuthenticated, {}, { token });

  if (!isAuthed) redirect("/login");

  return (
    <>
      {/* <Suspense fallback={<GuestAlertSkeleton />}>
        <GuestAlert isAuthenticated={isAuth} />
      </Suspense> */}
      {children}
    </>
  );
}
