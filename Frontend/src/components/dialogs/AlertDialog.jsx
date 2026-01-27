import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { authService } from "@/services/auth/AuthService";
import { Verification } from "./Verification";
import { useState } from "react";

export function MyAlertDialog({ open, onOpenChange, email }) {
  const [verificationOpen, setVerificationOpen] = useState(false);
  const sendEmail = async () => {
    try {
      console.log(email);

      const response = await authService.sendVerificationEmail(email);
      if (response?.data?.success) {
        setVerificationOpen(true);
      }
    } catch (error) {
      console.log("error", error?.response);
    }
  };
  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to send verification email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={sendEmail}>Send</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Verification
        open={verificationOpen}
        onOpenChange={setVerificationOpen}
        email={email}
      />
    </>
  );
}
