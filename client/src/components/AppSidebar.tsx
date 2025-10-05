"use client";

import * as React from "react";
import { PersonStanding } from "lucide-react";

import { Friends } from "@/components/Friends";
import { NavUser } from "@/components/NavUser";
import { NavHeader } from "@/components/NavHeader";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  friends: [
    {
      name: "Friend 1",
      icon: PersonStanding,
    },
    {
      name: "Friend 2",
      icon: PersonStanding,
    },
    {
      name: "Friend 3",
      icon: PersonStanding,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <Friends friends={data.friends} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
