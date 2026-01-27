import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOtp } from "../Input-Otp/InputOtp";
import { useState } from "react";
import { authService } from "@/services/auth/AuthService";
import { useNavigate } from "react-router";

export function Verification({ open, onOpenChange, email }) {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    //call verify Api
    const response = await authService.verifyEmail({ email, otp });
    if (response?.data?.success) {
      navigate("/", { replace: true });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
          <DialogDescription>
            {`Please check your email ${email}`}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="otp">OTP</Label>
            <InputOtp value={otp} onChange={setOtp} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={otp.length !== 6}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
