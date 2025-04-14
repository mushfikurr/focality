"use client";

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Chat } from "./elements/chat";
import PariticpantList from "./elements/participant-list";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

interface SyncedRoomProps {
  preloadedRoom: Preloaded<typeof api.rooms.queries.getRoomBySession>;
  preloadedParticipants: Preloaded<typeof api.rooms.queries.listParticipants>;
  preloadedChat: Preloaded<typeof api.chat.queries.listChatMessages>;
  preloadedSession: Preloaded<typeof api.session.queries.getSession>;
}

export function SyncedRoom(props: SyncedRoomProps) {
  const {
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
  console.log(chatMessages);
  const messages = chatMessages.filter(Boolean).map((m) => ({
    id: m?._id as string,
    content: m?.content as string,
    sender: m.sender?.name as string,
  }));

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
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <h1>Room: {room.shareId}</h1>
          <p className="text-muted-foreground text-xs">ID: {room.shareId}</p>
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
