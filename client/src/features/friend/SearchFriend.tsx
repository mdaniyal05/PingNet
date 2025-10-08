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
import { useSearchFriendToAddMutation } from "@/app/api/friendApi";

export default function SearchFriend() {
  const [searchPerson, setSearchPerson] = useState<string>("");
  const [found, setFound] = useState<boolean>(false);

  const [searchFriend, { isLoading }] = useSearchFriendToAddMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPerson(event.target.value);
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await searchFriend({ username: searchPerson });

      if (response) {
        if (response.error) {
          setFound(false);
        }

        if (response.data) {
          setFound(true);
        }
      }
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
            onSubmit={submitHandler}
          >
            <Input
              type="text"
              placeholder="Search username"
              value={searchPerson}
              onChange={handleChange}
            />
            <DialogTrigger asChild>
              <Button type="submit" variant="outline">
                {isLoading ? "Loading...." : "Search"}
              </Button>
            </DialogTrigger>

            {found ? (
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Name</Label>
                    <Input
                      id="name-1"
                      name="name"
                      defaultValue="Pedro Duarte"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="username-1">Username</Label>
                    <Input
                      id="username-1"
                      name="username"
                      defaultValue="@peduarte"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            ) : (
              <DialogContent className="sm:max-w-[425px]">
                {isLoading ? (
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
