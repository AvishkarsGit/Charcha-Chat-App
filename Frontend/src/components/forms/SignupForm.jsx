import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// import { useAuth } from "@/context/useAuth";
import { authService } from "@/services/auth/AuthService";
import { useState } from "react";
import { toast } from "react-toastify";
import { MyAlertDialog } from "../dialogs/AlertDialog";
import { Verification } from "../dialogs/Verification";

export function SignupForm({ ...props }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [verificationOpen, setVerificationOpen] = useState(false);
  const sendEmail = async () => {
    try {
      console.log(email);

      const response = await authService.sendVerificationEmail(email);
      if (response?.data?.success) {
        setVerificationOpen(true);
        toast.success("Email sent successfully");
      }
    } catch (error) {
      console.log("error", error?.response);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.warn("Password does not match");
        return;
      }

      const data = {
        name,
        email,
        password,
      };
      const response = await authService.signup(data);
      if (response?.data?.success) {
        toast.success("Account created successfully..");
        await sendEmail();
      }
    } catch (error) {
      alert(error?.response?.data?.message);
    }
  };

  return (
    <>
      <Card {...props}>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
              </Field>
              <FieldGroup>
                <Field>
                  <Button type="submit">Create Account</Button>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Verification
        open={verificationOpen}
        onOpenChange={setVerificationOpen}
        email={email}
      />
    </>
  );
}
