import { Types } from "mongoose";
export interface ChatInterface {
  chatName: string;
  isGroupChat: boolean;
  users: Types.ObjectId[];
  latestMessage?: Types.ObjectId;
  groupAdmin?: Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
}
