import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";

interface SectionProps {
  header: {
    title: string;
    icon: LucideIcon;
  };
  children: React.ReactNode;
  bottom?: React.ReactNode;
  hasBorder?: boolean;
}

export default function Section({
  header,
  children,
  hasBorder,
  bottom,
}: SectionProps) {
  return (
    <Collapsible
      className="group flex min-h-full flex-col space-y-1"
      defaultOpen={true}
    >
      <CollapsibleTrigger asChild>
        <div className="flex w-full items-center justify-between gap-3">
          <span className="flex items-center gap-3">
            <header.icon className="text-primary h-4 w-4" /> {header.title}
          </span>
          <Button
            className="group-hover:bg-accent/50"
            variant="ghost"
            size="icon"
          >
            <ChevronDown className="text-foreground aspect-square h-4 transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className={cn(hasBorder && "border")}>
        <ScrollArea className="max-h-full overflow-y-auto text-xs">
          {children}
        </ScrollArea>
        {bottom}
      </CollapsibleContent>
    </Collapsible>
  );
}
