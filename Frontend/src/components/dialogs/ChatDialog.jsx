import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth/AuthService";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";
import LoadUser from "../users/LoadUser";
import UserSkeleton from "../users/UserSkeleton";
// import { useChat } from "@/context/chat/useChat";//
import { chatService } from "@/services/chat/ChatService";
import { toast } from "react-toastify";
import { useChat } from "@/context/chat/useChat";
// import { authService } from "@/services/auth/AuthService";
// import { Verification } from "./Verification";
// import { useState } from "react";
// import { toast } from "react-toastify";

export function ChatDialog({ open, onOpenChange }) {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setChats, chats } = useChat();
  const [loadUser, setLoadUser] = useState(null);

  useEffect(() => {
    if (!name.trim()) {
      setUsers([]);
      setLoadUser(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await authService.search(name);
        if (response?.data?.success) {
          setUsers(response?.data?.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer); //cleanup
  }, [name]);

  const handleClick = async () => {
    const { data } = await chatService.createChat(loadUser?._id);
    console.log(data);

    if (data?.success) {
      if (data?.message === "CHAT_CREATED") {
        toast.warning("Chat already created with this user", {
          delay: 2000,
        });
      } else {
        //new chat created
        setChats([...chats, ...data.data]);
        toast.success("Chat created successfully", {
          delay: 2000,
        });
        onOpenChange(false);
      }
    }
  };
  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Create new by searching user
            </AlertDialogDescription>
            <Input
              id="name"
              type="text"
              placeholder="(e.g. John doe )"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div>
              {loading ? (
                <div>
                  <UserSkeleton />
                  <UserSkeleton />
                  <UserSkeleton />
                </div>
              ) : (
                users.map((user) => (
                  <LoadUser
                    onSelect={() => setLoadUser(user)}
                    key={user?._id}
                    user={user}
                  />
                ))
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={!loadUser} onClick={handleClick}>
              Create
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
