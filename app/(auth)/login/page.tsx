import LoginForm from "@/components/forms/login-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function LoginPage() {
  return (
    <Suspense fallback={<Skeleton className="max-w-md" />}>
      <LoginForm />
    </Suspense>
  );
}
