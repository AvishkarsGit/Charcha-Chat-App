import { MessageCircleMore, Presentation, UsersRound } from "lucide-react";

export const NavItems = {
  navMain: [
    {
      title: "Chats",
      url: "/",
      icon: MessageCircleMore,
      isActive: true,
    },
    {
      title: "Groups",
      url: "/groups",
      icon: UsersRound,
      isActive: true,
    },
    {
      title: "Meetings",
      url: "/meetings",
      icon: Presentation,
      isActive: true,
    },
  ],
};
