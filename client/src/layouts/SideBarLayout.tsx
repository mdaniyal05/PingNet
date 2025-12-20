import { AppSidebar } from "@/components/AppSidebar";
import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SearchFriend from "@/features/friend/SearchFriend";
import ChatLayout from "./ChatLayout";

export default function SideBarLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background top-0 flex shrink-0 items-center justify-between border-b">
          <div className="flex items-center gap-2 p-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <div className="flex items-center gap-2 p-4">
            <SearchFriend />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <ModeToggle />
          </div>
        </header>
        <ChatLayout />
      </SidebarInset>
    </SidebarProvider>
  );
}
