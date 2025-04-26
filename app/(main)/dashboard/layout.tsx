import GuestAlert from "@/components/common/guest-alert";
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isAuth = await isAuthenticatedNextjs();
  return (
    <>
      <GuestAlert isAuthenticated={isAuth} />
      {children}
    </>
  );
}
