import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  // useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { NavUser } from "./NavUser";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth/AuthService";
import { UserRoundPlus } from "lucide-react";

import { ChatDialog } from "@/components/dialogs/ChatDialog";
import Chat from "../Chat/Chat";
import { Outlet } from "react-router";
import { useAuth } from "@/context/auth/useAuth";
import { useChat } from "@/context/chat/useChat";
export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [chatOpen, setOnChatOpen] = useState(false);
  // const { isMobile } = useSidebar();

  const { selectedChat } = useChat();

  useEffect(() => {
    if (user !== null) return;
    authService
      .profile()
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
          </div>
          <div
            className="cursor-pointer bg-blue-500 hover:bg-blue-800 p-1.5 rounded-xl text-white"
            onClick={() => setOnChatOpen(true)}
          >
            <UserRoundPlus />
          </div>
          <div className="ml-auto px-3">
            <NavUser user={user} />
          </div>
          {/* chat dialog */}
          <ChatDialog open={chatOpen} onOpenChange={setOnChatOpen} />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min">
            {!selectedChat ? <h1>Chat app</h1> : <Chat />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
