import { useEffect, useState } from "react";
import { ChatContext } from "./ChatContext";
import { chatService } from "@/services/chat/ChatService";
import { useAuth } from "../auth/useAuth";

export const ChatProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);

  const { isLoggedIn, loader } = useAuth();

  useEffect(() => {
    async function fetchChats() {
      if (!isLoggedIn || loader) return;
      try {
        const { data } = await chatService.fetchAllChats();
        if (data.success) {
          setChats(data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setChatLoading(false);
      }
    }

    fetchChats();
  }, [isLoggedIn, loader]);

  const values = {
    selectedUser,
    setSelectedUser,
    chats,
    setChats,
    chatLoading,
    selectedChat,
    setSelectedChat,
    filteredChats,
    setFilteredChats,
  };
  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};
