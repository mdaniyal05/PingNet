import { useAppSelector } from "@/hooks/useStore";
import { currentActiveChat } from "../features/chat/socketSlice";
import NoChatSelected from "@/features/chat/NoChatSelected";
import ChatContainer from "@/features/chat/ChatContainer";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const ChatLayout = () => {
  const navigate = useNavigate();

  const isChatActive = useAppSelector(currentActiveChat);

  useEffect(() => {
    if (!isChatActive) {
      navigate("/sidebar");
    }
  }, [isChatActive, navigate]);

  return isChatActive ? <ChatContainer /> : <NoChatSelected />;
};

export default ChatLayout;
