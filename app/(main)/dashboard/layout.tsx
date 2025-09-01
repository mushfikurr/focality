import GuestAlert, {
  GuestAlertSkeleton,
} from "@/components/common/guest-alert";
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isAuth = await isAuthenticatedNextjs();
  if (!isAuth) redirect("/login");

  return (
    <>
      {/* <Suspense fallback={<GuestAlertSkeleton />}>
        <GuestAlert isAuthenticated={isAuth} />
      </Suspense> */}
      {children}
    </>
  );
}
