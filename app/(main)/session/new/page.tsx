import NewSessionForm from "@/components/forms/new-session-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewSessionPage() {
  return (
    <div className="container mx-auto w-full max-w-xl py-8">
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
          <NewSessionForm />
        </CardContent>
      </Card>
    </div>
  );
}
