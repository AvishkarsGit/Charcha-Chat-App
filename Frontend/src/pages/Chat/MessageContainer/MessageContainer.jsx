import React from "react";

function MessageContainer({ messages, user }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`max-w-[70%] px-4 py-2 text-sm rounded-xl
              ${
                msg.sender._id === user._id
                  ? "ml-auto bg-green-500 text-white rounded-br-none"
                  : "mr-auto bg-gray-200 text-gray-900 rounded-bl-none"
              }
            `}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}

export default MessageContainer;
