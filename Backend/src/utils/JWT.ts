import Bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getEnvironmentsVariable } from "../environments/environment";
export class JWT {
  static async encryptPassword(password: string) {
    const hashedPassword = await Bcrypt.hash(password, 10);
    return hashedPassword;
  }

  static generateAccessToken(payload: any) {
    return jwt.sign(payload, getEnvironmentsVariable().access_token_secrete!, {
      expiresIn: "15m",
    });
  }
  static generateRefreshToken(payload: any) {
    return jwt.sign(payload, getEnvironmentsVariable().refresh_token_secrete!, {
      expiresIn: "10h",
    });
  }

  static comparePassword(password: string, encryptedPassword: string) {
    return new Promise((resolve, reject) => {
      Bcrypt.compare(password, encryptedPassword, function (err, same) {
        if (err) {
          reject(err);
        } else if (!same) {
          reject(new Error("Invalid username and password"));
        } else {
          resolve(true);
        }
      });
    });
  }

  static async jwtVerify(token: string, secrete: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secrete, (err, decoded) => {
        if (err) {
          reject(err);
        } else if (!decoded) {
          reject(new Error("Unauthorized request"));
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
