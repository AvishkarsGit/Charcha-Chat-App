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
import { Verification } from "@/components/dialogs/Verification";
import {
  DialogContent,
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { MyAlertDialog } from "@/components/dialogs/AlertDialog";
import { useAuth } from "@/context/useAuth";
import { toast } from "react-toastify";

export function LoginForm({ className, ...props }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login({ email, password });
      if (response?.data?.success) {
        setLoggedIn(true);
        toast.success("Logged in successfully..");
        navigate("/", { replace: true });
      } else if (response?.data?.code === "EMAIL_NOT_VERIFIED") {
        alert("Email not verified");
        //open verification modal
        setDialogOpen(true);
      }
    } catch (error) {
      alert(error?.response?.data?.message);
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
