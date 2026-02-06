import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { GroupAvatar } from "@/components/Users/GroupAvatar";
import { MoreVertical, Video } from "lucide-react";
import React from "react";

function ChatHeader({ selectedUser }) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b bg-white p-4">
      <SidebarTrigger className="-ml-1" />
      <Avatar className="h-10 w-10">
        <AvatarImage src={selectedUser?.photo} />
        <AvatarFallback>{selectedUser?.name?.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <span className="font-semibold text-gray-900">
          {selectedUser?.name}
        </span>
        <span className="text-xs text-green-500">online</span>
      </div>
    </div>
  );
}

export default ChatHeader;
