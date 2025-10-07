import { socket } from "./socket";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchFriendToAddMutation } from "@/app/api/friendApi";

export default function ChatContainer() {
  const [searchPerson, setSearchPerson] = useState<string>("");

  const [searchFriend, { isLoading }] = useSearchFriendToAddMutation();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

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
    <>
      <div className="flex w-full max-w-sm items-center gap-2">
        <form onSubmit={submitHandler}>
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
    </>
  );
}
