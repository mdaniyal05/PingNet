import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatBox() {
  return (
    <Card className="w-full max-w-md h-[500px] flex flex-col">
      <CardHeader className="font-bold text-lg">Chat</CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-4">
            {/* Bot Message */}
            <div className="flex items-start gap-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <div className="px-3 py-2 rounded-2xl bg-muted text-muted-foreground max-w-[75%]">
                Hey
              </div>
            </div>

            {/* User Message */}
            <div className="flex items-start gap-2 justify-end">
              <div className="px-3 py-2 rounded-2xl bg-primary text-primary-foreground max-w-[75%]">
                Hey
              </div>
              <Avatar>
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <div className="flex gap-2 p-2 border-t">
        <Input placeholder="Type a message..." />
        <Button>Send</Button>
      </div>
    </Card>
  );
}
