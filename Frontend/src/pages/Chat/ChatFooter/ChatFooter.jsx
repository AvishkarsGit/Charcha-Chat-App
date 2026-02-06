import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

function ChatFooter({ message, typingHandler, handleSendMessage }) {
  return (
    <>
      <div className="shrink-0 flex items-center gap-2 border-t px-4 py-3">
        <Input
          placeholder="Type a message"
          className="rounded-full"
          value={message}
          onChange={typingHandler}
        />
        <Button
          size="icon"
          className="rounded-full"
          onClick={handleSendMessage}
        >
          ➤
        </Button>
      </div>
    </>
  );
}

export default ChatFooter;
