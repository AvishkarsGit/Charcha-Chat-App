import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Chat from "../Chat/ChatContainer/Chat";
import { useChat } from "@/context/chat/useChat";
import { AppSidebar } from "./AppSidebar";
import NoChatSelected from "../Chat/NoChatSelected/NoChatSelected";
export default function Dashboard() {

   const { selectedChat } = useChat();


  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "385px",
      }}
    >
      <AppSidebar />
      <SidebarInset>
        {selectedChat ? <Chat /> : <NoChatSelected />}
      </SidebarInset>
    </SidebarProvider>
  );
}
