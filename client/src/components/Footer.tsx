import { MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background text-muted-foreground py-8 px-4 sm:px-6 lg:px-8 border-t">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MessageSquare className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-foreground">PingNet</span>
        </div>
        <p className="text-sm">&copy; 2024 PingNet. All rights reserved.</p>
      </div>
    </footer>
  );
}
