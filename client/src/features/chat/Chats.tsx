import React from "react";
import { useShowFriendListQuery } from "@/app/api/friendApi";
import { type Friend } from "../../types/friendTypes";
import { Link } from "react-router";

export default function Chats() {
  const [allFriends, setAllFriends] = React.useState<Friend[]>([]);
  const [activeChat, setActiveChat] = React.useState<boolean>(false);
  // const [isNewMessage, setIsNewMessage] = React.useState<boolean>(false);

  const { data: list, isLoading: listLoading } = useShowFriendListQuery({});

  React.useEffect(() => {
    if (list) {
      setAllFriends(list?.data?.friendsList?.friendsList);
    }
  }, [list]);

  const onClickActive = () => {
    setActiveChat(true);
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
                    activeChat
                      ? `bg-sidebar-accent flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 cursor-pointer`
                      : `hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 cursor-pointer`
                  }
                  onClick={onClickActive}
                >
                  <div className="flex w-full items-center gap-2">
                    <span>{item.username}</span>{" "}
                    {/* {isNewMessage && (
                      <div className="bg-red-900 rounded-full w-2 h-2"></div>
                    )} */}
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
