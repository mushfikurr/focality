import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Scroller } from "../../ui/scroller";
import { RectReadOnly } from "react-use-measure";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ParticipantsList from "./participants-list";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ParticipantsPopover {
  isParticipantsOpen: boolean;
  setIsParticipantsOpen: (isOpen: boolean) => void;
  participants: Doc<"users">[];
}

export const ParticipantsPopover: React.FC<ParticipantsPopover> = ({
  isParticipantsOpen,
  setIsParticipantsOpen,
  participants,
}) => {
  return (
    <Popover
      open={isParticipantsOpen}
      onOpenChange={(o) => setIsParticipantsOpen(o)}
    >
      <PopoverTrigger asChild>
        <span className="sr-only w-full" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        alignOffset={0}
        className="flex max-w-full flex-col gap-4 bg-none"
      >
        <div className="flex items-center justify-between gap-3">
          <h1 className="leading-none font-semibold">Participants</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsParticipantsOpen(false)}
          >
            <X />
          </Button>
        </div>
        <div className="flex flex-grow flex-col overflow-auto">
          <Scroller className="flex-grow">
            <ParticipantsList participants={participants} />
          </Scroller>
        </div>
      </PopoverContent>
    </Popover>
  );
};
