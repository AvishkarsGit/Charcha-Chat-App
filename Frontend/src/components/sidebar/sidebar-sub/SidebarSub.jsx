import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SearchForm } from "@/pages/Dashboard/SearchForm";
import React, { useMemo, useState } from "react";
import { Outlet } from "react-router";

function SidebarSub({ chats }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const trimmed = search.trim();

    // 🔁 If search is empty → show all chats
    if (!trimmed) return chats;

    const searchText = trimmed.toLowerCase();

    return chats.filter((chat) => {
      const chatNameMatch = chat?.chatName?.toLowerCase().includes(searchText);

      const userNameMatch = chat?.users?.some((user) =>
        user?.name?.toLowerCase().includes(searchText),
      );
      return chatNameMatch || userNameMatch;
    });
  }, [search, chats]);


  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-foreground text-base font-medium">Charcha</div>
        </div>
        {/* <SidebarInput placeholder="Type to search..." /> */}
        <SearchForm
          search={search}
          setSearch={(e) => setSearch(e.target.value)}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <Outlet context={{ filtered }} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default SidebarSub;
