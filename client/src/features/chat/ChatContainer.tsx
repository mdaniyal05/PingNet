/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Plus, Phone, Video, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { socket } from "./socket";
import {
  useSendMessageMutation,
  useGetMessagesQuery,
} from "@/app/api/messageApi";
import { useParams } from "react-router";

export default function ChatContainer() {
  const { receiverId } = useParams();

  const [allMessages, setAllMessages] = useState<any[] | null>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const { data: messages, isLoading: messagesLoading } =
    useGetMessagesQuery(receiverId);

  const onClickSendMessage = async () => {
    try {
      const response = await sendMessage({
        _id: receiverId,
        text: newMessage,
      }).unwrap();

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (messages) {
      setAllMessages(messages.data?.messages);
    }

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    return () => {
      socket.off("connect");

      socket.off("connect_error");

      socket.disconnect();
    };
  }, [messages]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold">John Doe</h3>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 min-h-0 p-4">
        <div className="flex flex-col gap-4">
          {/* Received Message */}
          <div className="flex items-start gap-3 max-w-[80%]">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="rounded-lg bg-muted px-4 py-2">
                <p className="text-sm">Hey! How are you doing today?</p>
              </div>
              <span className="text-xs text-muted-foreground px-2">
                10:30 AM
              </span>
            </div>
          </div>

          {/* Sent Message */}
          <div className="flex items-start gap-3 max-w-[80%] self-end">
            <div className="flex flex-col gap-1 items-end">
              <div className="rounded-lg bg-primary text-primary-foreground px-4 py-2">
                <p className="text-sm">I'm doing great! Thanks for asking.</p>
              </div>
              <span className="text-xs text-muted-foreground px-2">
                10:32 AM
              </span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="You" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </ScrollArea>

      <Separator />

      {/* Input Area */}
      <div className="p-4 bg-background shrink-0">
        <div className="flex items-end gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
            <Plus className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              className="pr-12 min-h-[40px] resize-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          <Button
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={onClickSendMessage}
          >
            {isLoading ? "Loading..." : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
