import { useAuth } from "@/context/auth/useAuth";
import { useChat } from "@/context/chat/useChat";
import { getSocket } from "@/hooks/useSocket";
import { messageService } from "@/services/message/MessageService";
import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "../ChatHeader/ChatHeader";
import ChatFooter from "../ChatFooter/ChatFooter";
import MessageContainer from "../MessageContainer/MessageContainer";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator";

function Chat() {
  const { user } = useAuth();
  const { selectedChat, setSelectedUser, selectedUser } = useChat();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);
  const typingHandler = (e) => {
    setMessage(e.target.value);
    if (!socketConnected || !selectedChat) return;

    const socket = getSocket();

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    // clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const { data } = await messageService.sendMessage(
        message,
        selectedChat._id,
      );
      if (data?.success) {
        setMessage("");
        setMessages([...messages, data?.data]);

        const socket = getSocket();
        socket.emit("new message", data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function getAllMessages() {
    const socket = getSocket();
    try {
      const { data } = await messageService.fetchAllMessages(selectedChat?._id);
      if (data?.success) {
        setMessages(data?.data);

        //emit the room event
        socket.emit("join_chat", selectedChat._id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const socket = getSocket();
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("message received", (newMessage) => {
      if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
        // notification logic later
      } else {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("connected");
      socket.off("message received");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [user, selectedChat]);

  useEffect(() => {
    if (!selectedChat) return;
    const socket = getSocket();

    const receiver = selectedChat.users.filter((u) => u?._id !== user?._id);
    setSelectedUser(receiver[0]);

    //load all messages
    Promise.resolve().then(() => getAllMessages());
    socket.emit("join chat", selectedChat._id);
  }, [selectedChat]);

  return (
    <div className="relative flex h-dvh  flex-col bg-white">
      {/* Header */}
      <ChatHeader selectedChat={selectedChat} selectedUser={selectedUser} />
      {/* Message Container */}
      <MessageContainer messages={messages} user={user} />

      {/* typing indicator */}
      {isTyping && <TypingIndicator />}
      <ChatFooter
        message={message}
        typingHandler={typingHandler}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}
export default Chat;
