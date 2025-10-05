import { MessageCircleIcon } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="size-20 rounded-full flex items-center justify-center mb-6">
        <MessageCircleIcon className="size-10" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
      <p className="text-slate-600 max-w-md">
        Choose a friend from the sidebar to start chatting or continue a
        previous conversation.
      </p>
    </div>
  );
};

export default NoChatSelected;
