import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import LoadChats from "@/components/Users/LoadChats";
import { SearchForm } from "@/pages/Dashboard/SearchForm";
import React from "react";

function SidebarSub({ chats }) {
  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-foreground text-base font-medium">Charcha</div>
        </div>
        {/* <SidebarInput placeholder="Type to search..." /> */}
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {/* sidebar chats */}
            <LoadChats chats={chats} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default SidebarSub;
