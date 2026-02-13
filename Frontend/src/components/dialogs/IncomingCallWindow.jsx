import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PhoneOff, Video } from "lucide-react";

export default function IncomingCallWindow({
  open,
  callerName = "John Doe",
  callerAvatar,
  onAccept,
  onReject,
}) {



  return (
    <Dialog open={open}>
      <DialogContent className="max-w-xs rounded-2xl p-6">
        <DialogHeader className="items-center text-center space-y-3">
          <Avatar className="h-20 w-20">
            <AvatarImage src={callerAvatar} />
            <AvatarFallback>{callerName?.charAt(0)}</AvatarFallback>
          </Avatar>

          <DialogTitle className="text-lg font-semibold">
            {callerName}
          </DialogTitle>

          <p className="text-sm text-muted-foreground">Incoming video call…</p>
        </DialogHeader>

        <div className="mt-6 flex justify-center gap-8">
          {/* Reject */}
          <Button
            onClick={onReject}
            className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
          >
            <PhoneOff className="h-7 w-7 text-white" />
          </Button>

          {/* Accept */}
          <Button
            onClick={onAccept}
            className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
          >
            <Video className="h-7 w-7 text-white" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
