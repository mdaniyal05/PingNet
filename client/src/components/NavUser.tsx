import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogoutMutation } from "@/app/api/authApi";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { logout, selectCurrentUser } from "@/features/auth/authSlice";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileQuery } from "@/app/api/userApi";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function NavUser() {
  const { isMobile } = useSidebar();

  const [userInfo, setUserInfo] = useState({
    username: "",
    fullname: "",
    email: "",
    about: "",
    dateOfBirth: "",
    avatar: "",
  });

  const currentUser = useAppSelector(selectCurrentUser);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: userProfile, isLoading: profileLoading } = useProfileQuery({});

  const [logoutUser, { isLoading }] = useLogoutMutation();

  useEffect(() => {
    if (userProfile) {
      setUserInfo({
        username: userProfile.data.username,
        fullname: userProfile.data.fullname,
        email: userProfile.data.email,
        about: userProfile.data.about,
        dateOfBirth: userProfile.data.dateOfBirth.toString(),
        avatar: userProfile.data.avatar,
      });
    }
  }, [userProfile]);

  const onClickLogout = async () => {
    try {
      const response = await logoutUser({}).unwrap();
      dispatch(logout());
      navigate("/");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="" alt="Avatar" />
                <AvatarFallback className="rounded-lg">A</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {currentUser?.fullname}
                </span>
                <span className="truncate text-xs">{currentUser?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userInfo?.avatar} alt="Avatar" />
                  <AvatarFallback className="rounded-lg">A</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {currentUser?.fullname}
                  </span>
                  <span className="truncate text-xs">
                    {currentUser?.username}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <BadgeCheck />
                      Profile
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    {profileLoading ? (
                      "Loading...."
                    ) : (
                      <>
                        <DialogHeader>
                          <DialogTitle>Edit profile</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                          <div className="grid gap-3">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              name="username"
                              defaultValue={userInfo?.username}
                              disabled
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input
                              id="fullname"
                              name="fullname"
                              defaultValue={userInfo?.fullname}
                              disabled
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              defaultValue={userInfo?.email}
                              disabled
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="about">About</Label>
                            <Input
                              id="about"
                              name="about"
                              defaultValue={userInfo?.about}
                              disabled
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                              id="dob"
                              name="dob"
                              defaultValue={userInfo?.dateOfBirth.slice(0, 10)}
                              disabled
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </form>
              </Dialog>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClickLogout}>
              <LogOut />
              {isLoading ? "Loading...." : "Log Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
