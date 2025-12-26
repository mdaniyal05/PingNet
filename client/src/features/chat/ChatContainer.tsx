import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { socket } from "./socket";
import {
  useSendMessageMutation,
  useGetMessagesQuery,
} from "@/app/api/messageApi";
import { useParams } from "react-router";
import { useAppSelector } from "@/hooks/useStore";
import { selectCurrentUser } from "../auth/authSlice";
import formatDate from "@/helper/formatDate";
import EmojiPicker from "emoji-picker-react";

type Message = {
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
};

export default function ChatContainer() {
  const { receiverId } = useParams<{ receiverId: string }>();

  const user = useAppSelector(selectCurrentUser);

  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [onlineFriends, setOnlineFriends] = useState<Set<string>>(new Set());
  const [receiverData, setReceiverData] = useState({
    fullname: "",
    username: "",
    avatar: "",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { data } = useGetMessagesQuery(receiverId, { skip: !receiverId });
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  useEffect(() => {
    socket.connect();

    socket.on("new-message", (message: Message) => {
      setRealtimeMessages((prev) => [...prev, message]);
    });

    socket.on("receiver-data", (receiverData) => {
      setReceiverData({
        fullname: receiverData?.fullname,
        username: receiverData?.username,
        avatar: receiverData?.avatar,
      });
    });

    socket.on("connect_error", () => {});

    return () => {
      socket.off("new-message");
    };
  }, []);

  useEffect(() => {
    if (receiverId) {
      socket.emit("join-room", receiverId);
      setRealtimeMessages([]);
    }
  }, [receiverId]);

  useEffect(() => {
    if (!receiverId) return;

    let typingTimeout: NodeJS.Timeout;

    const handleKeyDown = () => {
      socket.emit("typing", receiverId);

      clearTimeout(typingTimeout);

      typingTimeout = setTimeout(() => {
        socket.emit("stop-typing", receiverId);
      }, 1000);
    };

    addEventListener("keydown", handleKeyDown);

    return () => {
      removeEventListener("keydown", handleKeyDown);
      clearTimeout(typingTimeout);
    };
  }, [receiverId]);

  useEffect(() => {
    socket.on("user-stopped-typing", (senderId) => {
      if (senderId) {
        setIsTyping(false);
      }
    });

    socket.on("user-typing", (senderId) => {
      if (senderId) {
        setIsTyping(true);
      }
    });

    return () => {
      socket.off("user-stopped-typing");
    };
  }, []);

  useEffect(() => {
    socket.on("online-friends", (friends: string[]) => {
      setOnlineFriends(new Set(friends));
    });

    return () => {
      socket.off("online-friends");
    };
  }, []);

  useEffect(() => {
    socket.on("friend-online", ({ userId }) => {
      setOnlineFriends((prev) => new Set(prev).add(userId));
    });

    socket.on("friend-offline", ({ userId }) => {
      setOnlineFriends((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    return () => {
      socket.off("friend-online");
      socket.off("friend-offline");
    };
  }, []);

  const messages: Message[] = useMemo(() => {
    return [...(data?.data?.messages || []), ...realtimeMessages];
  }, [data, realtimeMessages]);

  const onSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputMessage.trim() || !receiverId || !user) return;

    const payload = {
      senderId: user._id,
      receiverId: receiverId,
      text: inputMessage,
    };

    socket.emit("send-message", payload);
    await sendMessage({ _id: payload.receiverId, text: payload.text }).unwrap();

    setInputMessage("");
    setShowEmojiPicker(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEmojiClick = (emojiData: any) => {
    setInputMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-background shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={receiverData?.avatar} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold">{receiverData?.fullname}</h3>
            <p className="text-xs text-muted-foreground">
              {isTyping
                ? "Typing..."
                : onlineFriends.has(receiverId!)
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg, idx) => {
            const isMine = msg.senderId === user?._id;

            return (
              <div
                key={idx}
                className={`flex gap-3 ${
                  isMine ? "self-end flex-row-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage
                    src={isMine ? user.avatar : receiverData?.avatar}
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div
                  className={`flex flex-col ${
                    isMine ? "items-end" : "items-start"
                  } max-w-[75%]`}
                >
                  <div
                    className={`inline-block rounded-lg px-4 py-2 text-sm break-words ${
                      isMine ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <span className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <form onSubmit={onSend} className="relative flex gap-2 items-center">
          <Button variant="outline" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            😊
          </Button>
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-0 z-50">
              <EmojiPicker onEmojiClick={onEmojiClick} width={300} />
            </div>
          )}
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button size="icon" type="submit" disabled={isLoading}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
