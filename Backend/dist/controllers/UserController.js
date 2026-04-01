"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const JWT_1 = require("../utils/JWT");
const Utility_1 = require("../utils/Utility");
const User_1 = __importDefault(require("../models/User"));
const environment_1 = require("../environments/environment");
class UserController {
    static async signup(req, res, next) {
        try {
            const { name, email, password } = req.body;
            console.log(name, email, password);
            //check if user is already exist
            const isUser = await User_1.default.findOne({ email }).select("email");
            if (isUser)
                throw new Error("user is already exists");
            //encrypt password
            const hashedPassword = await JWT_1.JWT.encryptPassword(password);
            const data = {
                name,
                email,
                password: hashedPassword,
                photo: "",
                verification_token: "000000",
            };
            //save to db
            const user = await new User_1.default(data).save();
            if (!user)
                throw new Error("Failed to insert data");
            //payload
            const payload = {
                id: user._id,
            };
            //generate tokens
            const accessToken = JWT_1.JWT.generateAccessToken(payload);
            const refreshToken = JWT_1.JWT.generateRefreshToken(payload);
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
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            //check email is exists or not
            const user = await User_1.default.findOne({ email });
            if (!user)
                throw new Error("User does not exists");
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
                await JWT_1.JWT.comparePassword(password, hashedPass);
            }
            catch (error) {
                throw error;
            }
            //payload
            const payload = {
                id: user._id,
            };
            //generate tokens
            const accessToken = JWT_1.JWT.generateAccessToken(payload);
            const refreshToken = JWT_1.JWT.generateRefreshToken(payload);
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
        }
        catch (error) {
            next(error);
        }
    }
    static async sendVerificationEmail(req, res, next) {
        try {
            const { email } = req.body;
            //check if user is exist with this email
            const user = await User_1.default.findOne({ email });
            if (!user)
                throw new Error("user does not exist!");
            //generate otp
            const otp = Utility_1.Utility.generateOTP();
            //update in db
            const updated = await User_1.default.findOneAndUpdate({
                email: user.email,
            }, {
                $set: {
                    verification_token: otp,
                    verification_token_expiry: new Date(Date.now() + Utility_1.Utility.MAX_OTP_TIME),
                },
            }, {
                new: true,
            });
            if (!updated)
                throw new Error("Failed to send email");
            return res.json({
                success: true,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async verifyEmail(req, res, next) {
        try {
            const { email, otp } = req.body;
            //check if user is exist with this email
            const user = await User_1.default.findOne({ email });
            if (!user)
                throw new Error("user does not exist!");
            //verify email
            const updatedUser = await User_1.default.findOneAndUpdate({
                email: user.email,
                verification_token: otp,
                verification_token_expiry: { $gt: Date.now() },
            }, {
                $set: {
                    isVerified: true,
                },
            }, {
                new: true,
            });
            if (!updatedUser)
                throw new Error("OTP Wrong or Expired");
            return res.json({
                success: true,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getProfile(req, res, next) {
        try {
            const { id } = req.user;
            if (!id)
                throw new Error("id not found");
            const user = await User_1.default.findOne({
                _id: id,
            }).select("name email isVerified");
            if (!user)
                throw new Error("user not found!");
            return res.json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async refreshToken(req, res, next) {
        try {
            const token = req.cookies?.refreshToken;
            //check if token is present or not
            if (!token)
                throw new Error("Refresh token must be there");
            //decode refresh token
            const decoded = await JWT_1.JWT.jwtVerify(token, environment_1.env.refresh_token_secrete);
            //check decoded is valid
            const user = await User_1.default.findOne({ _id: decoded.id });
            if (!user)
                throw new Error("invalid refresh token");
            //payload
            const payload = {
                id: user?._id,
            };
            //generate new accessToken and refreshToken
            const accessToken = JWT_1.JWT.generateAccessToken(payload);
            const refreshToken = JWT_1.JWT.generateRefreshToken(payload);
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
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            const id = req.user.id;
            if (!id)
                throw new Error("id must be provided");
            const user = await User_1.default.findOne({ _id: id });
            if (!user)
                throw new Error("user not found!");
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
        }
        catch (error) {
            next(error);
        }
    }
    static async getMyData(req, res, next) {
        try {
            const { id } = req.user;
            const user = await User_1.default.findOne({
                _id: id,
            }).select("name email isVerified");
            if (!user)
                throw new Error("user not found!");
            return res.json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProfile(req, res, next) {
        try {
            const { id } = req.user;
            if (!id)
                throw new Error("id must be there");
            const { name } = req.body;
            const user = await User_1.default.findOneAndUpdate({ _id: id }, {
                $set: {
                    name,
                },
            }, {
                new: true,
            });
            if (!user)
                throw new Error("Failed to update profile");
            return res.json({
                success: true,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getUsers(req, res, next) {
        try {
            const search = req.query.search;
            if (!search?.trim()) {
                return res.json({
                    success: false,
                    message: "Please enter something to search",
                });
            }
            //escape special characters
            const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const keyword = escapeRegex(search.trim());
            const users = await User_1.default.find({
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
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
