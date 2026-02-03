import { z } from "zod";

export class UserValidator {
  static signup() {
    return z.object({
      name: z.string().trim().min(4, "name should be at least 4 character"),
      email: z.email(),
    //  photo: z.string().trim(),
      password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters"),
    });
  }

  static login() {
    return z.object({
      email: z.email(),
      password: z.string().trim(),
    });
  }
  static verifyEmail() {
    return z.object({
      email: z.email(),
      otp: z.string(),
    });
  }
  static sendVerificationEmail() {
    return z.object({
      email: z.email(),
    });
  }

  static profile() {
    return z.object({
      name: z.string(),
    });
  }
}
