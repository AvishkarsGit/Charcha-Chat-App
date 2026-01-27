export interface UserInterface {
  name: string;
  email: string;
  password: string;
  photo:string;
  isVerified?: boolean;
  verification_token: string;
  verification_token_expiry?: Date;
  created_at?: Date;
  updated_at?: Date;
}
