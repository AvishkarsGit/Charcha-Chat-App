import { UserInterface } from "../interfaces/UserInterface";
import { JWT } from "../utils/JWT";
import { Utility } from "../utils/Utility";
import User from "../models/User";
import { env } from "../environments/environment";
export class UserController {
  static async signup(req: any, res: any, next: any) {
    try {
      const { name, email, password } = req.body;
      console.log(name, email, password);

      //check if user is already exist
      const isUser = await User.findOne({ email }).select("email");
      if (isUser) throw new Error("user is already exists");

      //encrypt password
      const hashedPassword = await JWT.encryptPassword(password);

      const data: UserInterface = {
        name,
        email,
        password: hashedPassword,
        photo: "",
        verification_token: "000000",
      };

      //save to db
      const user = await new User(data).save();
      if (!user) throw new Error("Failed to insert data");

      //payload
      const payload = {
        id: user._id,
      };

      //generate tokens
      const accessToken = JWT.generateAccessToken(payload);
      const refreshToken = JWT.generateRefreshToken(payload);

      //cookie options
      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          success: true,
        });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: any, res: any, next: any) {
    try {
      const { email, password } = req.body;
      //check email is exists or not
      const user = await User.findOne({ email });
      if (!user) throw new Error("User does not exists");

      //check if email is verified
      if (!user?.isVerified) {
        return res.json({
          success: false,
          code: "EMAIL_NOT_VERIFIED",
        });
      }

      //get Hashed Password
      const hashedPass = user.password;

      //compare password
      try {
        await JWT.comparePassword(password, hashedPass);
      } catch (error) {
        throw error;
      }

      //payload
      const payload = {
        id: user._id,
      };

      //generate tokens
      const accessToken = JWT.generateAccessToken(payload);
      const refreshToken = JWT.generateRefreshToken(payload);

      //cookie options
      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          success: true,
          data: {
            accessToken,
            refreshToken,
          },
        });
    } catch (error) {
      next(error);
    }
  }

  static async sendVerificationEmail(req: any, res: any, next: any) {
    try {
      const { email } = req.body;

      //check if user is exist with this email
      const user = await User.findOne({ email });
      if (!user) throw new Error("user does not exist!");

      //generate otp
      const otp = Utility.generateOTP();

      //update in db
      const updated = await User.findOneAndUpdate(
        {
          email: user.email,
        },
        {
          $set: {
            verification_token: otp,
            verification_token_expiry: new Date(
              Date.now() + Utility.MAX_OTP_TIME,
            ),
          },
        },
        {
          new: true,
        },
      );

      if (!updated) throw new Error("Failed to send email");

      return res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: any, res: any, next: any) {
    try {
      const { email, otp } = req.body;

      //check if user is exist with this email
      const user = await User.findOne({ email });
      if (!user) throw new Error("user does not exist!");

      //verify email
      const updatedUser = await User.findOneAndUpdate(
        {
          email: user.email,
          verification_token: otp,
          verification_token_expiry: { $gt: Date.now() },
        },
        {
          $set: {
            isVerified: true,
          },
        },
        {
          new: true,
        },
      );

      if (!updatedUser) throw new Error("OTP Wrong or Expired");

      return res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: any, res: any, next: any) {
    try {
      const { id } = req.user;

      if (!id) throw new Error("id not found");

      const user = await User.findOne({
        _id: id,
      }).select("name email isVerified");

      if (!user) throw new Error("user not found!");

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: any, res: any, next: any) {
    try {
      const token = req.cookies?.refreshToken;

      //check if token is present or not
      if (!token) throw new Error("Refresh token must be there");

      //decode refresh token
      const decoded: any = await JWT.jwtVerify(
        token,
        env.refresh_token_secrete,
      );

      //check decoded is valid
      const user = await User.findOne({ _id: decoded.id });
      if (!user) throw new Error("invalid refresh token");

      //payload
      const payload = {
        id: user?._id,
      };

      //generate new accessToken and refreshToken
      const accessToken = JWT.generateAccessToken(payload);
      const refreshToken = JWT.generateRefreshToken(payload);

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          success: true,
          data: {
            accessToken,
            refreshToken,
          },
        });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: any, res: any, next: any) {
    try {
      const id = req.user.id;

      if (!id) throw new Error("id must be provided");

      const user = await User.findOne({ _id: id });
      if (!user) throw new Error("user not found!");

      const options = {
        httpOnly: true,
        secure: true,
      };
      return res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
          success: true,
          message: "user logout successfully",
        });
    } catch (error) {
      next(error);
    }
  }

  static async getMyData(req: any, res: any, next: any) {
    try {
      const { id } = req.user;
      const user = await User.findOne({
        _id: id,
      }).select("name email isVerified");

      if (!user) throw new Error("user not found!");

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: any, res: any, next: any) {
    try {
      const { id } = req.user;
      if (!id) throw new Error("id must be there");
      const { name } = req.body;
      const user = await User.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name,
          },
        },
        {
          new: true,
        },
      );

      if (!user) throw new Error("Failed to update profile");

      return res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: any, res: any, next: any) {
    try {
      const search = req.query.search;

      if (!search?.trim()) {
        return res.json({
          success: false,
          message: "Please enter something to search",
        });
      }

      //escape special characters
      const escapeRegex = (text: any) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const keyword = escapeRegex(search.trim());

      const users = await User.find({
        _id: { $ne: req.user.id },
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      }).select("name email");

      return res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
}
