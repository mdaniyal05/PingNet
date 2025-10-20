import * as React from "react";
import {
  MessageSquareCodeIcon,
  UserCircle,
  UserSquare,
  Inbox,
} from "lucide-react";

import { NavUser } from "@/components/NavUser";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";

import { useShowFriendRequestsQuery } from "../app/api/friendApi";

const data = {
  navMain: [
    {
      title: "Inbox",
      url: "/inbox",
      icon: Inbox,
      isActive: true,
    },
    {
      title: "Friend List",
      url: "/friends",
      icon: UserCircle,
      isActive: false,
    },
    {
      title: "Friend Requests",
      url: "/friends",
      icon: UserSquare,
      isActive: false,
    },
  ],
};

type FriendRequests = {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  about: string;
  avatar: string;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const [allRequests, setAllRequests] = React.useState<FriendRequests[]>([]);
  const { setOpen } = useSidebar();

  const { data: requests, isLoading } = useShowFriendRequestsQuery({});

  React.useEffect(() => {
    if (requests) {
      setAllRequests(requests?.data?.friendRequests?.friendRequests);
      console.log(requests?.data?.friendRequests?.friendRequests);
    }
  }, [requests]);

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <MessageSquareCodeIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        setOpen(true);
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
      {/* This is the second sidebar */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem?.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {isLoading ? (
                "Loading...."
              ) : (
                <>
                  {requests &&
                    activeItem.title === "Friend Requests" &&
                    allRequests.map((item) => (
                      <a
                        href="#"
                        key={item._id}
                        className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                      >
                        <div className="flex w-full items-center gap-2">
                          <span>{item.username}</span>{" "}
                        </div>
                        <span className="font-medium">{item.fullname}</span>
                        <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                          {item.email}
                        </span>
                      </a>
                    ))}
                </>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
