import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "@/hooks/useSocket";
import { useAuth } from "@/context/auth/useAuth";
import { peerService } from "@/services/webRtc/PeerService";

export default function VideoCallDialog({ open, onClose, selectedUser }) {
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const myStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const { user } = useAuth();

  const toggleMic = () => {
    if (myStreamRef.current) {
      const audioTrack = myStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (myStreamRef.current) {
      const videoTrack = myStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const cleanupCall = useCallback(() => {
    console.log("Cleaning up call...");

    // Stop my stream
    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach((track) => {
        console.log("Stopping my track:", track.kind);
        track.stop();
      });
      myStreamRef.current = null;
    }

    // Stop remote stream
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => {
        console.log("Stopping remote track:", track.kind);
        track.stop();
      });
      remoteStreamRef.current = null;
    }

    // Clear video elements
    if (myVideoRef.current) {
      myVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Close peer connection
    peerService.close();

    // Reset states
    setMyStream(null);
    setRemoteStream(null);
    setIsMicOn(true);
    setIsCameraOn(true);

    onClose();
  }, [onClose]);

  const endCall = () => {
    const socket = getSocket();

    // Notify the other user that call is ending
    socket.emit("call:end", {
      from: user?._id,
      to: selectedUser?._id,
    });

    // Cleanup local resources
    cleanupCall();
  };

  useEffect(() => {
    const initCall = async () => {
      const socket = getSocket();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        myStreamRef.current = stream;
        setMyStream(stream);

        peerService.createPeer(
          (candidate) => {
            socket.emit("ice:candidate", {
              from: user._id,
              to: selectedUser?._id,
              candidate
            });
          },
          (remoteStream) => {
            remoteStreamRef.current = remoteStream;
            setRemoteStream(remoteStream);
          }
        );

        peerService.addTracks(stream);

        const offer = await peerService.createOffer();
        socket.emit("user:call", {
          from: user._id,
          to: selectedUser?._id,
          offer,
        });
      } catch (error) {
        console.error("Error accessing media devices:", error);
        cleanupCall();
      }
    };

    if (open && !myStream) {
      initCall();
    }
  }, [open, myStream, user._id, selectedUser?._id, cleanupCall]);

  // Update video element when stream changes
  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  // Remote stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Socket listeners
  useEffect(() => {
    const socket = getSocket();

    const handleUserCall = async ({ offer }) => {
      const answer = await peerService.createAnswer(offer);
      socket.emit("call:accepted", {
        from: user?._id,
        to: selectedUser?._id,
        answer,
      });
    };

    const handleCallAccepted = async ({ answer }) => {
      await peerService.setAnswer(answer);
    };

    const handleIceCandidate = async ({ candidate }) => {
      await peerService.addIceCandidate(candidate);
    };

    socket.on("user:call", handleUserCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("ice:candidate", handleIceCandidate);

    return () => {
      socket.off("user:call", handleUserCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("ice:candidate", handleIceCandidate);
    };
  }, [selectedUser?._id, user?._id]);

  // Handle call end from remote user
  useEffect(() => {
    const socket = getSocket();

    const handleCallEnd = () => {
      console.log("Received call:end event from remote user");
      cleanupCall();
    };

    socket.on("call:end", handleCallEnd);

    return () => {
      socket.off("call:end", handleCallEnd);
    };
  }, [cleanupCall]);

  // Handle page unload
  useEffect(() => {
    const handleUnload = () => {
      const socket = getSocket();
      socket.emit("call:end", {
        from: user?._id,
        to: selectedUser?._id
      });
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [selectedUser?._id, user?._id]);

  // Cleanup on unmount or when dialog closes
  useEffect(() => {
    if (!open) {
      // If dialog is closed, cleanup
      if (myStreamRef.current || remoteStreamRef.current) {
        cleanupCall();
      }
    }

    return () => {
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach((track) => track.stop());
        myStreamRef.current = null;
      }
      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach((track) => track.stop());
        remoteStreamRef.current = null;
      }
      peerService.close();
    };
  }, [open, cleanupCall]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && endCall()}>
      <DialogContent className="max-w-4xl p-0 bg-gray-900 border-gray-800">
        <DialogTitle className="sr-only">
          Video Call with {selectedUser?.name}
        </DialogTitle>

        {/* Main video container */}
        <div className="relative w-full h-[600px] bg-gray-950">
          {/* Remote video (main/large) */}
          <div className="absolute inset-0">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-3xl font-semibold mb-4">
                  {selectedUser?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <p className="text-lg font-medium">{selectedUser?.name || "User"}</p>
                <p className="text-sm text-gray-500">Waiting to connect...</p>
              </div>
            )}
          </div>

          {/* My video (small/picture-in-picture) */}
          <div className="absolute bottom-20 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-xl border-2 border-gray-700">
            <video
              ref={myVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isCameraOn && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Call controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {/* Mic toggle */}
            <Button
              onClick={toggleMic}
              size="lg"
              variant={isMicOn ? "secondary" : "destructive"}
              className="rounded-full w-14 h-14"
            >
              {isMicOn ? (
                <Mic className="w-6 h-6" />
              ) : (
                <MicOff className="w-6 h-6" />
              )}
            </Button>

            {/* Camera toggle */}
            <Button
              onClick={toggleCamera}
              size="lg"
              variant={isCameraOn ? "secondary" : "destructive"}
              className="rounded-full w-14 h-14"
            >
              {isCameraOn ? (
                <Video className="w-6 h-6" />
              ) : (
                <VideoOff className="w-6 h-6" />
              )}
            </Button>

            {/* End call */}
            <Button
              onClick={endCall}
              size="lg"
              variant="destructive"
              className="rounded-full w-14 h-14"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>

          {/* User info overlay (top left) */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-white font-medium">{selectedUser?.name || "User"}</p>
            <p className="text-green-400 text-sm">Connected</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
