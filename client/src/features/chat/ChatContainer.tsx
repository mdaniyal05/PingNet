import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Plus, Phone, Video, MoreVertical } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { socket } from "./socket";
import {
  useSendMessageMutation,
  useGetMessagesQuery,
} from "@/app/api/messageApi";
import { useParams } from "react-router";
import { useAppSelector } from "@/hooks/useStore";
import { selectCurrentUser } from "../auth/authSlice";

type Message = {
  senderId: string;
  receiverId: string;
  text: string;
};

export default function ChatContainer() {
  const { receiverId } = useParams<{ receiverId: string }>();
  const user = useAppSelector(selectCurrentUser);

  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const { data } = useGetMessagesQuery(receiverId);
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  useEffect(() => {
    socket.connect();

    socket.on("new-message", (message: Message) => {
      console.log(message);

      setRealtimeMessages((prev) => [...prev, message]);
    });

    socket.on("connect_error", () => {});

    return () => {
      socket.off("new-message");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (receiverId) {
      socket.emit("join-room", receiverId);
      setRealtimeMessages([]);
    }
  }, [receiverId]);

  const messages: Message[] = useMemo(() => {
    return [...(data?.data?.messages || []), ...realtimeMessages];
  }, [data, realtimeMessages]);

  const onSend = async () => {
    if (!inputMessage.trim() || !receiverId || !user) return;

    const payload = {
      senderId: user._id,
      receiverId: receiverId,
      text: inputMessage,
    };

    socket.emit("send-message", payload);
    await sendMessage({ _id: payload.receiverId, text: payload.text }).unwrap();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-background shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold">Chat</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg, idx) => {
            const isMine = msg.senderId === user?._id;

            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-[80%] ${
                  isMine ? "self-end flex-row-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div className={`flex flex-col ${isMine ? "items-end" : ""}`}>
                  <div
                    className={`rounded-lg px-4 py-2 text-sm ${
                      isMine ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-4">
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button size="icon" onClick={onSend} disabled={isLoading}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
