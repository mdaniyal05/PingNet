import { useAppSelector } from "@/hooks/useStore";
import { currentActiveChat } from "../features/chat/socketSlice";
import NoChatSelected from "@/features/chat/NoChatSelected";
import ChatContainer from "@/features/chat/ChatContainer";

const ChatLayout = () => {
  const isChatActive = useAppSelector(currentActiveChat);

  console.log(isChatActive);

  return isChatActive ? <ChatContainer /> : <NoChatSelected />;
};

export default ChatLayout;
