import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GroupAvatar } from "@/components/Users/GroupAvatar";
import { useAuth } from "@/context/auth/useAuth";
import { useChat } from "@/context/chat/useChat";
import { messageService } from "@/services/message/MessageService";
import { MoreVertical, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
function Chat() {
  const { user } = useAuth();
  const { selectedChat, setSelectedUser, selectedUser } = useChat();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const { data } = await messageService.sendMessage(
        message,
        selectedChat._id,
      );
      if (data?.success) {
        setMessage("");
        setMessages([...messages, data?.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function getAllMessages() {
    try {
      const { data } = await messageService.fetchAllMessages(selectedChat?._id);
      if (data?.success) {
        setMessages(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const receiver = selectedChat?.users?.filter((u) => u?._id !== user?._id);
    setSelectedUser(receiver[0]);

    //load all messages
    Promise.resolve().then(() => getAllMessages());
  }, [selectedChat]);



  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-3">
          {selectedChat?.isGroupChat ? (
            <GroupAvatar users={selectedChat?.users} />
          ) : (
            <Avatar>
              <AvatarImage src={selectedUser?.photo} />
              <AvatarFallback>
                {selectedUser?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          <div>
            <p className="text-sm font-medium">
              {selectedChat?.isGroupChat
                ? selectedChat?.chatName
                : selectedUser?.name}
            </p>
            <p className="text-xs text-muted-foreground">online</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 text-muted-foreground">
          <button className="hover:text-foreground transition">
            <Video className="h-5 w-5" />
          </button>

          {/* Optional: menu */}
          <button className="hover:text-foreground transition">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto bg-muted/40 px-4 py-3 space-y-2">
        {/* Incoming */}
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={
              msg?.sender._id === user?._id ? `flex justify-end` : `flex`
            }
          >
            <div
              className={`inline-flex max-w-[75%] flex-col rounded-lg ${msg?.sender._id === user?._id ? "bg-primary text-primary-foreground" : "bg-background"} px-3 py-2 text-sm shadow`}
            >
              <p>{msg.content}</p>
              <span
                className={`mt-1 self-end text-[10px] ${msg?.sender._id === user?._id ? "opacity-80" : "text-primary-foreground"}`}
              >
                {new Date(msg?.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 border-t px-4 py-3">
        <Input
          placeholder="Type a message"
          className="rounded-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          size="icon"
          className="rounded-full"
          onClick={handleSendMessage}
        >
          ➤
        </Button>
      </div>
    </div>
  );
}

export default Chat;
