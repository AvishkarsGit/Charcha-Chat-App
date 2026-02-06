import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/context/auth/useAuth";
import { useChat } from "@/context/chat/useChat";

function LoadChats({ chats }) {
  const { user } = useAuth();
  const { setSelectedChat } = useChat();

  const getOtherUser = (users, loggedInUserId) => {
    return users.find((user) => user._id !== loggedInUserId);
  };

  return (
    <div className="w-85 border-r h-full overflow-y-auto">
      {chats
        ?.filter((chat) => !chat?.isGroupChat) // ❌ remove group chats
        .map((chat) => {
          const otherUser = getOtherUser(chat.users, user?._id);

          if (!otherUser) return null;

          return (
            <div
              key={chat?._id}
              onClick={() => setSelectedChat(chat)}
              className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-200 transition cursor-pointer m-2"
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={otherUser?.photo} className="object-cover" />
                <AvatarFallback className="bg-red-100 text-red-600 font-semibold">
                  {otherUser?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <span className="text-gray-900 text-base font-semibold leading-tight">
                  {otherUser?.name}
                </span>
                <p className="text-gray-500 text-sm truncate max-w-50">
                  {chat.latestMessage?.content || "No messages yet"}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default LoadChats;
