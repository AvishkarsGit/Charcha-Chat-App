import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChat } from "@/context/chat/useChat";
import React, { useEffect, useRef } from "react";

function MessageContainer({ messages, user }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const { selectedChat } = useChat();

  const isGroupChat = selectedChat?.isGroupChat;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((msg) => {
        const isSender = msg?.sender?._id === user?._id;

        return (
          <div
            key={msg?._id}
            className={`flex ${isSender ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex gap-2 max-w-[70%] ${isSender ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Show avatar only for group chats and only for received messages */}
              {isGroupChat && !isSender && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage
                    src={msg?.sender?.photo}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                    {msg?.sender?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`inline-block px-3 py-2 rounded-xl
                  ${
                    isSender
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }
                `}
              >
                {/* Show sender name only in group chats for received messages */}
                {isGroupChat && !isSender && (
                  <p className="text-xs font-semibold text-blue-600 mb-1">
                    {msg?.sender?.name}
                  </p>
                )}

                <p className="text-sm wrap-break-words">{msg?.content}</p>

                <span
                  className={`text-[10px] mt-1 block text-right
                    ${isSender ? "text-green-100" : "text-gray-500"}
                  `}
                >
                  {formatTime(msg?.created_at)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      {/* Invisible element at the end to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageContainer;
