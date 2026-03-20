import { cn } from "@/lib/utils";
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
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { authService } from "@/services/auth/AuthService";
// import { Verification } from "@/components/dialogs/Verification";
// import {
//   DialogContent,
//   Dialog,
//   DialogTrigger,
//   DialogTitle,
//   DialogDescription,
// } from "../ui/dialog";
import { MyAlertDialog } from "@/components/dialogs/AlertDialog";

import { toast } from "react-toastify";
import { useAuth } from "@/context/auth/useAuth";

export function LoginForm({ className, ...props }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setLoggedIn, setUser } = useAuth();

  const setUserData = async () => {
    try {
      const response = await authService.profile();
      if (response?.data?.success) {
        setUser(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.login({ email, password });

      if (response?.data?.success) {
        setLoggedIn(true);
        toast.success("Logged in successfully..");
        setUserData();
        navigate("/", { replace: true });
      } else if (response?.data?.code === "EMAIL_NOT_VERIFIED") {
        toast.warning("Please verify your email first");
        setDialogOpen(true);
      } else {
        toast.error(response?.data?.message || "Login failed");
      }
    } catch (error) {
      if (error.response) {
        const message =
          error.response.data?.message || "Invalid email or password";
        toast.error(message);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                      to="/"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>
                <Field>
                  <Button type="submit">Login</Button>

                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup">Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
      <MyAlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        email={email}
      />
    </>
  );
}
