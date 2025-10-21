import React from "react";
import {
  useShowFriendListQuery,
  useRemoveFriendMutation,
} from "@/app/api/friendApi";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type FriendList = {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  about: string;
  avatar: string;
};

export default function FriendList() {
  const [allFriends, setAllFriends] = React.useState<FriendList[]>([]);

  const [removeFriend, { isLoading: removeLoading }] =
    useRemoveFriendMutation();

  const { data: list, isLoading: listLoading } = useShowFriendListQuery({});

  React.useEffect(() => {
    if (list) {
      setAllFriends(list?.data?.friendsList?.friendsList);
    }
  }, [list]);

  const onClickRemoveFriend = async (id: string) => {
    try {
      const response = await removeFriend(id).unwrap();
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {listLoading ? (
        "Loading...."
      ) : (
        <>
          {list &&
            allFriends.map((item) => (
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
                    onClick={() => onClickRemoveFriend(item._id)}
                  >
                    {removeLoading ? "Loading..." : <X />}
                  </Button>
                </div>
              </a>
            ))}
        </>
      )}
    </>
  );
}
