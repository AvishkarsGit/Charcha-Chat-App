"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utility = void 0;
class Utility {
    static generateOTP(length = 6) {
        let otp = "";
        for (let i = 1; i <= length; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        return otp;
    }
}
exports.Utility = Utility;
Utility.MAX_OTP_TIME = 2 * 60 * 1000;
