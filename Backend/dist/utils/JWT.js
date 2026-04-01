"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../environments/environment");
class JWT {
    static async encryptPassword(password) {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        return hashedPassword;
    }
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, environment_1.env.access_token_secrete, {
            expiresIn: "15m",
        });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, environment_1.env.refresh_token_secrete, {
            expiresIn: "10h",
        });
    }
    static comparePassword(password, encryptedPassword) {
        return new Promise((resolve, reject) => {
            bcrypt_1.default.compare(password, encryptedPassword, function (err, same) {
                if (err) {
                    reject(err);
                }
                else if (!same) {
                    reject(new Error("Invalid username and password"));
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    static async jwtVerify(token, secrete) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, secrete, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                else if (!decoded) {
                    reject(new Error("Unauthorized request"));
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
}
exports.JWT = JWT;
