"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

interface Session {
  id: string;
  shareId: string;
  title: string;
}

interface RenameSessionDialogProps {
  session: Session;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameSessionDialog({
  session,
  open,
  onOpenChange,
}: RenameSessionDialogProps) {
  const updateSession = useMutation(api.session.mutations.updateSession);
  const [newTitle, setNewTitle] = useState(session.title);

  const handleRename = async () => {
    if (!newTitle.trim()) return;
    try {
      await updateSession({
        sessionId: session.id as Id<"sessions">,
        title: newTitle.trim(),
      });
      toast.success("Session renamed");
      onOpenChange(false);
    } catch {
      toast.error("Failed to rename session");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setNewTitle(session.title); // Reset on close
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Rename Session</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter new title"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleRename();
              }}
            >
              Rename
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
