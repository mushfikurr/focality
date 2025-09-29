"use client";
import { MoreHorizontal, Copy, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { RenameSessionDialog } from "./rename-session-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  shareId: string;
  title: string;
}

interface SessionMenuProps {
  session: Session;
}

export function SessionMenu({ session }: SessionMenuProps) {
  const deleteSession = useMutation(api.session.mutations.deleteSession);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      window.location.origin + "/session/id/" + session.shareId,
    );
    toast.success("Link copied to clipboard");
  };

  const handleDelete = async () => {
    try {
      await deleteSession({ sessionId: session.id as Id<"sessions"> });
      toast.success("Session deleted");
    } catch {
      toast.error("Failed to delete session");
    }
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "-mr-0.5 h-6 w-6 p-0",
              dropdownOpen
                ? "bg-accent text-accent-foreground"
                : "active:bg-accent-foreground/10 hover:bg-accent-foreground/10",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleCopyLink();
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setRenameDialogOpen(true);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenameSessionDialog
        session={session}
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
      />
    </>
  );
}
