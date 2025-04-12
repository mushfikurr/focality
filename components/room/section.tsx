import { ChevronDown, LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

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
    <Collapsible className="group space-y-1" defaultOpen={true}>
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
        <ScrollArea className="max-h-[200px] overflow-y-auto text-xs">
          {children}
        </ScrollArea>
        {bottom}
      </CollapsibleContent>
    </Collapsible>
  );
}
