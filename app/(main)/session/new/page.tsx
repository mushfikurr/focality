import GuestAlert from "@/components/common/guest-alert";
import NewSessionForm from "@/components/forms/new-session-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";

export default async function NewSessionPage() {
  const authenticated = await isAuthenticatedNextjs();

  return (
    <div className="container mx-auto w-full max-w-xl space-y-3 py-8">
      <GuestAlert isAuthenticated={authenticated} />
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
