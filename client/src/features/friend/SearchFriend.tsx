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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useSearchFriendToAddMutation,
  useSendFriendRequestMutation,
} from "@/app/api/friendApi";
import { type FriendData } from "../../types/friendTypes";

export default function SearchFriend() {
  const [searchPerson, setSearchPerson] = useState<string>("");
  const [frientFound, setFrientFound] = useState<boolean>(false);
  const [friendData, setFriendData] = useState<FriendData>({
    _id: "",
    fullname: "",
    username: "",
    avatar: "",
  });

  const [searchFriend, { isLoading: searchLoading }] =
    useSearchFriendToAddMutation();
  const [sendFriendRequest, { isLoading: requestLoading }] =
    useSendFriendRequestMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPerson(event.target.value);
  };

  const submitHandlerSearchFriend = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setFrientFound(false);

      const response = await searchFriend({ username: searchPerson }).unwrap();

      if (response) {
        if (response.error) setFrientFound(false);
        if (response.data) setFrientFound(true);
      }

      const data = response.data;

      console.log(data);

      if (data) {
        setFriendData({
          _id: data?.user?._id,
          fullname: data?.user?.fullname,
          username: data?.user?.username,
          avatar: data?.user?.avatar,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onClickSendFriendRequest = async () => {
    try {
      const response = await sendFriendRequest(friendData._id);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mr-4">
        <Dialog>
          <form
            className="flex w-full max-w-sm items-center gap-2"
            onSubmit={submitHandlerSearchFriend}
          >
            <Input
              type="text"
              placeholder="Search username"
              value={searchPerson}
              onChange={handleChange}
            />
            <DialogTrigger asChild>
              <Button type="submit" variant="outline">
                {searchLoading ? "Loading...." : "Search"}
              </Button>
            </DialogTrigger>

            {frientFound ? (
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Friend Found</DialogTitle>
                  <DialogDescription>
                    A friend with this username is {friendData.username}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      name="fullname"
                      value={friendData?.fullname}
                      disabled
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={friendData?.username}
                      disabled
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={onClickSendFriendRequest}>
                    {requestLoading ? "Loading...." : "Send Friend Request"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            ) : (
              <DialogContent className="sm:max-w-[425px]">
                {searchLoading ? (
                  "Loading...."
                ) : (
                  <DialogHeader>
                    <DialogTitle>Not Found</DialogTitle>
                    <DialogDescription>
                      User with this username not found.
                    </DialogDescription>
                  </DialogHeader>
                )}
              </DialogContent>
            )}
          </form>
        </Dialog>
      </div>
    </>
  );
}
