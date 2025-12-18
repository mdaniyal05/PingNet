import React from "react";
import { useShowFriendListQuery } from "@/app/api/friendApi";
import { type Friend } from "../../types/friendTypes";
import { Link } from "react-router";
import { currentActiveChat, setActiveChat } from "../chat/socketSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";

export default function Chats() {
  const [allFriends, setAllFriends] = React.useState<Friend[]>([]);

  const dispatch = useAppDispatch();

  const isChatActive = useAppSelector(currentActiveChat);

  const { data: list, isLoading: listLoading } = useShowFriendListQuery({});

  React.useEffect(() => {
    if (list) {
      setAllFriends(list?.data?.friendsList?.friendsList);
    }
  }, [list]);

  const onClickActive = () => {
    dispatch(setActiveChat(true));
  };

  return (
    <>
      {listLoading ? (
        "Loading...."
      ) : (
        <>
          {list &&
            allFriends.map((item, idx) => (
              <Link to={`/sidebar/message/${item._id}`} key={idx}>
                <div
                  key={item._id}
                  className={
                    isChatActive
                      ? `bg-sidebar-accent flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 cursor-pointer`
                      : `hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 cursor-pointer`
                  }
                  onClick={onClickActive}
                >
                  <div className="flex w-full items-center gap-2">
                    <span>{item.username}</span>{" "}
                  </div>
                  <span className="font-medium">{item.fullname}</span>
                </div>
              </Link>
            ))}
        </>
      )}
    </>
  );
}
