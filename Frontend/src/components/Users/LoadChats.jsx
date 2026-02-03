import { cn } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { GroupAvatar } from "./GroupAvatar";
import { useAuth } from "@/context/auth/useAuth";
import { useChat } from "@/context/chat/useChat";

function LoadChats({ chats }) {
  const { user } = useAuth();
  const { selectedChat, setSelectedChat } = useChat();


  return (
    <div className="w-85 border-r h-full overflow-y-auto">
      {chats.map((chat) => {
        const isActive = selectedChat?._id === chat._id;
        const otherUser = !chat.isGroupChat
          ? chat.users?.find((u) => u._id !== user._id)
          : null;
        return (
          <div
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 cursor-pointer transition",
              isActive ? "bg-muted" : "hover:bg-muted/50",
            )}
          >
            {/* Avatar */}
            {chat.isGroupChat ? (
              <GroupAvatar users={chat?.users} />
            ) : (
              <Avatar className="h-12 w-12">
                <AvatarImage src={otherUser?.photo} />
                <AvatarFallback>{otherUser?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-medium truncate">
                  {chat.isGroupChat ? chat?.chatName : otherUser?.name}
                </p>
                <span className="text-xs text-muted-foreground">
                  {/* //{chat.time} */}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground truncate">
                  {chat?.latestMessage?.content || "No messages yet"}
                </p>

                {/* {chat.unreadCount > 0 && (
                  <span className="h-5 min-w-[20px] rounded-full bg-green-600 text-white text-xs flex items-center justify-center px-1">
                    {chat.unreadCount}
                  </span>
                )} */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LoadChats;
