import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";

export default function Nav() {
  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">PingNet</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">Login</Button>
            <Button>Sign Up</Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
