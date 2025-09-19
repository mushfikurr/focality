"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "../ui/button";
import ConfirmJoinSessionDialog from "./confirm-join-session-dialog";

type JoinSessionButtonProps = {
  session: Doc<"sessions">;
  children: React.ReactNode;
} & Omit<ButtonProps, "onClick">;

export function JoinSessionButton({
  session,
  children,
  ...props
}: JoinSessionButtonProps) {
  const router = useRouter();
  const currentUser = useQuery(api.auth.getCurrentUser);
  const joinSessionMutation = useMutation(api.session.mutations.joinSession);

  const handleJoin = async () => {
    if (!session._id || !session.shareId) return;
    await joinSessionMutation({ sessionId: session._id });
    router.push(`/session/id/${session.shareId}`);
  };

  const userInSession = !!currentUser?.sessionId;
  const isDifferentSession = currentUser?.sessionId !== session._id;

  if (userInSession && isDifferentSession) {
    return (
      <ConfirmJoinSessionDialog session={session} onConfirm={handleJoin}>
        <Button {...props}>{children}</Button>
      </ConfirmJoinSessionDialog>
    );
  }

  return (
    <Button {...props} onClick={handleJoin}>
      {children}
    </Button>
  );
}

