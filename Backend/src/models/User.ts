import { Schema, model } from "mongoose";
import { UserInterface } from "../interfaces/UserInterface";

const userSchema: Schema<UserInterface> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verification_token: {
    type: String,
    required: true,
  },
  verification_token_expiry: {
    type: Date,
    default: Date.now(),
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});
export default model<UserInterface>("User", userSchema);
