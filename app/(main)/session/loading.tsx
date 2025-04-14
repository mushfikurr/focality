import { Loader2 } from "lucide-react";

export default function SessionLoading() {
  return (
    <div className="container mx-auto flex h-full w-full justify-center gap-6 py-16">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      <h1 className="text-muted-foreground animate-pulse text-xl">
        Getting your session ready...
      </h1>
    </div>
  );
}
