"use client";

import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Link, Users2 } from "lucide-react";
import { useEffect } from "react";
import { AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Chat } from "./elements/chat";

interface SyncedRoomProps {
  preloadedRoom: Preloaded<typeof api.rooms.queries.getRoomBySession>;
  preloadedParticipants: Preloaded<typeof api.rooms.queries.listParticipants>;
  preloadedChat: Preloaded<typeof api.chat.queries.listChatMessages>;
  preloadedSession: Preloaded<typeof api.session.queries.getSession>;
  preloadedUser: Preloaded<typeof api.user.currentUser>;
}

export function SyncedRoom(props: SyncedRoomProps) {
  const {
    preloadedUser,
    preloadedParticipants,
    preloadedRoom,
    preloadedChat,
    preloadedSession,
  } = props;
  const participants = usePreloadedQuery(preloadedParticipants);
  const room = usePreloadedQuery(preloadedRoom);
  const chatMessages = usePreloadedQuery(preloadedChat);
  const session = usePreloadedQuery(preloadedSession);
  const participantList = participants?.filter(Boolean).map((p) => ({
    id: p?._id as string,
    name: p?.name as string,
  }));
  const user = usePreloadedQuery(preloadedUser);
  console.log(chatMessages);
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

  const joinRoomMtn = useMutation(api.rooms.mutations.joinRoom);
  // TODO: Create actual joining mechanism, this is for now.
  useEffect(() => {
    joinRoomMtn({ roomId: room._id });
  }, []);

  return (
    <Card className="flex h-full flex-col gap-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <div className="flex items-center">
            <div className="flex">
              {participants?.map((p) => (
                <Avatar key={p._id}>
                  <AvatarImage src={p.image} />
                  <AvatarFallback>{p?.name?.[0] ?? "A"}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button variant="outline" size="icon">
              <Users2 />
            </Button>
          </div>
          <h1 className="text-secondary-foreground inline-flex items-center gap-2 border border-dashed p-1 px-3 text-xs">
            {room.shareId}
          </h1>
        </CardTitle>
      </CardHeader>

      <CardContent className="min-h-0 flex-1">
        {/* <PariticpantList participants={participantList} /> */}
        <Chat
          onSendMessage={onSendMessage}
          messages={messages}
          disabled={session.session.running}
        />
      </CardContent>
    </Card>
  );
}
