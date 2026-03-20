import IncomingCallWindow from "@/components/dialogs/IncomingCallWindow";
import VideoCallDialog from "@/components/dialogs/VideoCallDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth/useAuth";
import { useChat } from "@/context/chat/useChat";
import { getSocket } from "@/hooks/useSocket";
import { peerService } from "@/services/webRtc/PeerService";
import { EllipsisVertical, Video } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

function ChatHeader({ selectedUser }) {
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isIncomingCallOpen, setIsIncomingCallOpen] = useState(false);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callerId, setCallerId] = useState(null); // Track who is calling

  const { user } = useAuth();
  const { selectedChat } = useChat();

  const handleCall = async () => {
    const socket = getSocket();

    socket.emit("incoming:call", {
      from: user?._id,
      to: selectedUser?._id,
    });

    setIsCallOpen(true);
  };

  const handleIncomingCall = useCallback(({ from }) => {
    console.log("Incoming call from:", from);
    setCallerId(from);
    setIsIncomingCallOpen(true);
  }, []);

  const handleCallAccept = async () => {
    const socket = getSocket();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setMyStream(stream);

      peerService.createPeer(
        (candidate) => {
          socket.emit("ice:candidate", {
            from: user?._id,
            to: selectedUser?._id,
            candidate,
          });
        },
        (remoteStream) => {
          setRemoteStream(remoteStream);
        },
      );

      peerService.addTracks(stream);

      socket.emit("call:accepted", {
        from: user?._id,
        to: selectedUser?._id,
      });

      setIsIncomingCallOpen(false);
      setIsCallOpen(true);
    } catch (error) {
      console.error("Error accepting call:", error);
      handleCallReject();
    }
  };

  const handleCallReject = () => {
    const socket = getSocket();

    socket.emit("call:rejected", {
      from: user?._id,
      to: selectedUser?._id,
    });

    setIsIncomingCallOpen(false);
    setIsCallOpen(false);
    setCallerId(null);
  };

  const handleCallClose = () => {
    setIsCallOpen(false);
    setMyStream(null);
    setRemoteStream(null);
  };

  useEffect(() => {
    const socket = getSocket();

    socket.emit("user:join", { userId: user?._id });

    // Handle incoming call
    socket.on("incoming:call", handleIncomingCall);

    // Handle call rejection
    const handleCallRejected = () => {
      console.log("Call was rejected by the other user");
      setIsCallOpen(false);
      setIsIncomingCallOpen(false);
      setCallerId(null);

      // Cleanup if we were calling
      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop());
        setMyStream(null);
      }
      peerService.close();
    };

    // Handle call end (when other user ends before we accept)
    const handleCallEnd = () => {
      console.log("Call ended by the other user");
      setIsCallOpen(false);
      setIsIncomingCallOpen(false);
      setCallerId(null);

      // Cleanup streams
      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop());
        setMyStream(null);
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
        setRemoteStream(null);
      }
      peerService.close();
    };

    socket.on("call:rejected", handleCallRejected);
    socket.on("call:end", handleCallEnd);

    return () => {
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:rejected", handleCallRejected);
      socket.off("call:end", handleCallEnd);
    };
  }, [handleIncomingCall, user?._id, myStream, remoteStream]);

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <Avatar>
            <AvatarImage src={selectedUser?.avatar} />
            <AvatarFallback>
              {selectedChat?.isGroupChat
                ? selectedChat?.chatName?.charAt(0)
                : selectedUser?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">
              {selectedChat?.isGroupChat
                ? selectedChat?.chatName
                : selectedUser?.name}
            </h2>
          </div>
        </div>

        {!selectedChat?.isGroupChat ?
          <button
            onClick={handleCall}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Video className="w-5 h-5" />
          </button>
          : <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <EllipsisVertical className="w-5 h-5" />
          </button>}
      </div>

      <IncomingCallWindow
        open={isIncomingCallOpen}
        onAccept={handleCallAccept}
        onReject={handleCallReject}
        callerName={selectedUser?.name}
      />

      <VideoCallDialog
        open={isCallOpen}
        onClose={handleCallClose}
        selectedUser={selectedUser}
      />
    </>
  );
}

export default ChatHeader;
