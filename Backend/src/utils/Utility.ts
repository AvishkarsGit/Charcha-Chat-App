export class Utility {
  static MAX_OTP_TIME = 2 * 60 * 1000;
  static generateOTP(length: number = 6) {
    let otp = "";
    for (let i = 1; i <= length; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }
}
