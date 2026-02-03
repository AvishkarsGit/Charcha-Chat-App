import React from "react";
import { MessageCircleMore } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SearchForm } from "./SearchForm";
import { useChat } from "@/context/chat/useChat";
import { Skeleton } from "@/components/ui/skeleton";
import UserSkeleton from "@/components/Users/UserSkeleton";
import LoadChats from "@/components/Users/LoadChats";
// This is sample data.

export function AppSidebar() {
  const { chatLoading, chats } = useChat();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <MessageCircleMore className="size-4" />
                  {/* <GalleryVerticalEnd className="size-4" /> */}
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Charcha</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {chatLoading ? <UserSkeleton /> : <LoadChats chats={chats} />}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
