import NewSessionForm from "@/components/forms/new-session-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { createAuth } from "@/lib/auth";
import { getToken } from "@convex-dev/better-auth/nextjs";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function NewSessionPage() {
  const token = await getToken(createAuth);
  const authenticated = !!(await fetchQuery(
    api.auth.getCurrentUser,
    {},
    { token },
  ));
  if (!token) redirect("/login");

  return (
    <div className="container mx-auto w-full max-w-xl space-y-3 pt-4 pb-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a new session</CardTitle>
          <CardDescription>
            <p>
              A session is a collection of tasks with predetermined durations.
              You can choose to make the session public or private to others.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewSessionForm authenticated={authenticated} />
        </CardContent>
      </Card>
    </div>
  );
}
