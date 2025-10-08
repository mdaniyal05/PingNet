import { AppSidebar } from "@/components/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ChatContainer from "@/features/chat/ChatContainer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchFriendToAddMutation } from "@/app/api/friendApi";

export default function SideBarLayout() {
  const [searchPerson, setSearchPerson] = useState<string>("");

  const [searchFriend, { isLoading }] = useSearchFriendToAddMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPerson(event.target.value);
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await searchFriend({ username: searchPerson });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

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
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Chat</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 mr-4">
            <form
              className="flex w-full max-w-sm items-center gap-2"
              onSubmit={submitHandler}
            >
              <Input
                type="text"
                placeholder="Search username"
                value={searchPerson}
                onChange={handleChange}
              />
              <Button type="submit" variant="outline">
                {isLoading ? "Loading...." : "Search"}
              </Button>
            </form>
          </div>
        </header>
        <ChatContainer />
      </SidebarInset>
    </SidebarProvider>
  );
}
