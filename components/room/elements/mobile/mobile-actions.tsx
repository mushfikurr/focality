"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MessageCircle, Users2 } from "lucide-react";
import { FC } from "react";
import { Chat } from "../chat";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ParticipantsList from "../participants-list";

interface MobileActionProps {
  preloadedRoom: Preloaded<typeof api.rooms.queries.getRoomBySession>;
  preloadedParticipants: Preloaded<typeof api.rooms.queries.listParticipants>;
  preloadedChat: Preloaded<typeof api.chat.queries.listChatMessages>;
  preloadedUser: Preloaded<typeof api.user.currentUser>;
  preloadedSession: Preloaded<typeof api.session.queries.getSession>;
}

const MobileActions: FC<MobileActionProps> = ({
  preloadedChat,
  preloadedRoom,
  preloadedUser,
  preloadedParticipants,
  preloadedSession,
}) => {
  const room = usePreloadedQuery(preloadedRoom);
  const chatMessages = usePreloadedQuery(preloadedChat);
  const user = usePreloadedQuery(preloadedUser);
  const participants = usePreloadedQuery(preloadedParticipants);
  const session = usePreloadedQuery(preloadedSession);

  const messages = chatMessages.filter(Boolean).map((m) => {
    if (m.sender?._id === user?._id) {
      return {
        id: m?._id as string,
        content: m?.content as string,
        sender: "You",
      };
    } else {
      return {
        id: m?._id as string,
        content: m?.content as string,
        sender: m.sender?.name as string,
      };
    }
  });

  if (!room) return null;

  const sendChatMessage = useMutation(api.chat.mutations.createChat);
  const onSendMessage = (message: string) => {
    sendChatMessage({ roomId: room._id, content: message });
  };

  return (
    <div className="bg-card text-card-foreground flex w-full items-center justify-center gap-2.5 border py-1.5 shadow-sm">
      <Action
        trigger={
          <Button size="icon" variant="ghost">
            <MessageCircle />
          </Button>
        }
        title={
          <>
            Session Chat{" "}
            <span className="text-muted-foreground inline-flex items-center justify-end gap-1.5 text-xs font-normal">
              <Users2 className="h-4 w-4" /> 1
            </span>
          </>
        }
        content={
          <Chat
            messages={messages}
            onSendMessage={onSendMessage}
            participants={participants}
            disabled={session.session.running}
          />
        }
      />
      <Action
        trigger={
          <Button size="icon" variant="ghost">
            <Users2 />
          </Button>
        }
        title={
          <>
            Participants{" "}
            <span className="text-muted-foreground inline-flex items-center justify-end gap-1.5 text-xs font-normal">
              <Users2 className="h-4 w-4" /> 1
            </span>
          </>
        }
        content={<ParticipantsList participants={participants} />}
      />
    </div>
  );
};

type ActionProps = {
  title: React.ReactNode;
  content: React.ReactNode;
  trigger: React.ReactNode;
};
export function Action({ title, content, trigger }: ActionProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="flex h-full flex-col">
        <div className="mx-auto flex h-full max-w-sm flex-col space-y-1 overflow-hidden pb-20">
          <DrawerHeader>
            <DrawerTitle className="inline-flex items-center justify-between gap-3">
              {title}
            </DrawerTitle>
          </DrawerHeader>
          {content}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default MobileActions;
