"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "../ui/button";
import ConfirmJoinSessionDialog from "./confirm-join-session-dialog";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { Slot } from "@radix-ui/react-slot";

type JoinSessionButtonProps = {
  session: Pick<Doc<"sessions">, "title" | "_id" | "shareId">;
  children: React.ReactNode;
  asChild?: boolean;
} & Omit<ButtonProps, "onClick">;

export function JoinSessionButton({
  session,
  children,
  asChild,
  ...props
}: JoinSessionButtonProps) {
  const router = useRouter();
  const currentUserQuery = useQuery(convexQuery(api.auth.getCurrentUser, {}));
  const { mutateAsync: joinSessionMutation } = useMutation({
    mutationFn: useConvexMutation(api.session.mutations.joinSession),
  });

  const handleJoin = async () => {
    if (!session._id || !session.shareId) return;
    await joinSessionMutation({ sessionId: session._id });
    router.push(`/session/id/${session.shareId}`);
  };

  const currentUser = currentUserQuery.data;

  const userInSession = !!currentUser?.sessionId;
  const isDifferentSession = currentUser?.sessionId !== session._id;

  const Comp = asChild ? Slot : Button;

  if (userInSession && isDifferentSession) {
    return (
      <ConfirmJoinSessionDialog session={session} onConfirm={handleJoin}>
        <Comp {...props}>{children}</Comp>
      </ConfirmJoinSessionDialog>
    );
  }

  return (
    <Comp {...props} onClick={handleJoin}>
      {children}
    </Comp>
  );
}
