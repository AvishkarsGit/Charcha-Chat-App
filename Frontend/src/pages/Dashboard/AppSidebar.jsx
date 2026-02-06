import React from "react";
import { MessageCircleMore, Presentation, UsersRound } from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { useChat } from "@/context/chat/useChat";
import { useAuth } from "@/context/auth/useAuth";
import SidebarSub from "@/components/sidebar/sidebar-sub/SidebarSub";
import SidebarMain from "@/components/sidebar/sidebar-main/SidebarMain";
import { NavItems } from "@/utils/NavItems";

export function AppSidebar() {
  const { chats } = useChat();
  const { user } = useAuth();

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
    >
      {/* main/first sidebar */}
      <SidebarMain data={NavItems} user={user} />

      {/* second sidebar */}
      <SidebarSub chats={chats} />
    </Sidebar>
  );
}
