import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function GroupAvatar({ users }) {
  return (
    <div className="relative h-12 w-12">
      <Avatar className="absolute left-0 top-0 h-7 w-7 border">
        <AvatarImage src={users[0]?.photo} />
        <AvatarFallback>{users[0]?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <Avatar className="absolute right-0 top-0 h-7 w-7 border">
        <AvatarImage src={users[1]?.photo} />
        <AvatarFallback>{users[1]?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <Avatar className="absolute left-2 bottom-0 h-7 w-7 border">
        <AvatarImage src={users[2]?.photo} />
        <AvatarFallback>{users[2]?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
    </div>
  );
}
