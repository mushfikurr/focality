import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {};

function SuggestedCard({}: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ready to start focusing?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link
          href="/session/new"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "flex w-full justify-start",
          )}
        >
          Start a new session
        </Link>
        <Link
          href="/explore"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "flex w-full justify-start",
          )}
        >
          Find a public session
        </Link>
      </CardContent>
    </Card>
  );
}

export default SuggestedCard;
