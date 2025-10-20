import React from "react";
import { useShowFriendRequestsQuery } from "@/app/api/friendApi";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type FriendRequests = {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  about: string;
  avatar: string;
};

export default function FriendRequests() {
  const [allRequests, setAllRequests] = React.useState<FriendRequests[]>([]);

  const { data: requests, isLoading } = useShowFriendRequestsQuery({});

  React.useEffect(() => {
    if (requests) {
      setAllRequests(requests?.data?.friendRequests?.friendRequests);
    }
  }, [requests]);

  return (
    <>
      {isLoading ? (
        "Loading...."
      ) : (
        <>
          {requests &&
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
                <div className="flex gap-3 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full cursor-pointer"
                  >
                    <Check />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full cursor-pointer"
                  >
                    <X />
                  </Button>
                </div>
              </a>
            ))}
        </>
      )}
    </>
  );
}
