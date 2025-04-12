import RegisterForm from "@/components/forms/register-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function RegisterPage() {
  return (
    <Suspense fallback={<Skeleton className="max-w-md" />}>
      <RegisterForm />
    </Suspense>
  );
}
