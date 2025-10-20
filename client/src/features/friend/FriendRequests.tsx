import React from "react";
import {
  useShowFriendRequestsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
} from "@/app/api/friendApi";
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

  const [acceptRequest, { isLoading: acceptRequestLoading }] =
    useAcceptFriendRequestMutation();
  const [rejectRequest, { isLoading: rejectRequestLoading }] =
    useRejectFriendRequestMutation();

  const { data: requests, isLoading } = useShowFriendRequestsQuery({});

  React.useEffect(() => {
    if (requests) {
      setAllRequests(requests?.data?.friendRequests?.friendRequests);
    }
  }, [requests]);

  const onClickAcceptRequest = async (id: string) => {
    try {
      const response = await acceptRequest(id);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickRejectRequest = async (id: string) => {
    try {
      const response = await rejectRequest(id);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

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
                    onClick={() => onClickAcceptRequest(item._id)}
                  >
                    {acceptRequestLoading ? "Loading..." : <Check />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full cursor-pointer"
                    onClick={() => onClickRejectRequest(item._id)}
                  >
                    {rejectRequestLoading ? "Loading..." : <X />}
                  </Button>
                </div>
              </a>
            ))}
        </>
      )}
    </>
  );
}
