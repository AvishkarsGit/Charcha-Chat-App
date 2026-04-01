"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
const zod_1 = require("zod");
class UserValidator {
    static signup() {
        return zod_1.z.object({
            name: zod_1.z.string().trim().min(4, "name should be at least 4 character"),
            email: zod_1.z.email(),
            //  photo: z.string().trim(),
            password: zod_1.z
                .string()
                .trim()
                .min(8, "Password must be at least 8 characters"),
        });
    }
    static login() {
        return zod_1.z.object({
            email: zod_1.z.email(),
            password: zod_1.z.string().trim(),
        });
    }
    static verifyEmail() {
        return zod_1.z.object({
            email: zod_1.z.email(),
            otp: zod_1.z.string(),
        });
    }
    static sendVerificationEmail() {
        return zod_1.z.object({
            email: zod_1.z.email(),
        });
    }
    static profile() {
        return zod_1.z.object({
            name: zod_1.z.string(),
        });
    }
}
exports.UserValidator = UserValidator;
