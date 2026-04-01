"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const Chat_1 = __importDefault(require("../models/Chat"));
const User_1 = __importDefault(require("../models/User"));
class ChatController {
    static async createChat(req, res, next) {
        try {
            const { receiverId } = req.body;
            const isChat = await Chat_1.default.find({
                isGroupChat: false,
                $and: [
                    { users: { $elemMatch: { $eq: req.user.id } } },
                    { users: { $elemMatch: { $eq: receiverId } } },
                ],
            })
                .populate("users", "name email photo")
                .populate("latestMessage");
            const chat = await User_1.default.populate(isChat, {
                path: "latestMessage.sender",
                select: "name email photo",
            });
            if (chat.length > 0) {
                return res.json({
                    success: true,
                    message: "CHAT_CREATED",
                    data: chat[0],
                });
            }
            const newChat = await new Chat_1.default({
                chatName: "sender",
                isGroupChat: false,
                users: [req.user.id, receiverId],
            }).save();
            const fullChat = await Chat_1.default.find({ _id: newChat._id }).populate("users", "name email photo");
            return res.json({
                success: true,
                data: fullChat,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async fetchAllChats(req, res, next) {
        try {
            const userId = req.user.id;
            let chats = await Chat_1.default.find({
                users: { $elemMatch: { $eq: userId } },
            })
                .populate("users", "name email photo")
                .populate("groupAdmin", "name email photo")
                .populate("latestMessage")
                .sort({ updatedAt: -1 });
            // populate latestMessage.sender
            chats = await User_1.default.populate(chats, {
                path: "latestMessage.sender",
                select: "name email photo",
            });
            if (!chats || chats.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Chats not found",
                });
            }
            return res.json({
                success: true,
                data: chats,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async fetchUser(req, res, next) {
        try {
            const { userId } = req.query;
            if (!userId)
                throw new Error("user id not provided");
            const user = await User_1.default.findOne({ _id: userId }).select("name email photo");
            if (!user)
                throw new Error("User not found");
            return res.json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    }
    static async createGroup(req, res, next) {
        try {
            const { name, users } = req.body;
            if (!name || !users) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide name and users",
                });
            }
            // users is STRING → parse it ONCE
            let groupMembers;
            try {
                groupMembers = JSON.parse(users);
            }
            catch (err) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid users JSON",
                });
            }
            // ensure array
            if (!Array.isArray(groupMembers)) {
                return res.status(400).json({
                    success: false,
                    message: "Users must be an array",
                });
            }
            // add current user (admin) if not present
            if (!groupMembers.includes(req.user.id)) {
                groupMembers.push(req.user.id);
            }
            // minimum members check
            if (groupMembers.length < 3) {
                return res.status(400).json({
                    success: false,
                    message: "Group must have at least 3 members",
                });
            }
            const groupChat = await Chat_1.default.create({
                chatName: name,
                users: groupMembers,
                isGroupChat: true,
                groupAdmin: req.user.id,
            });
            const fullGroupChat = await Chat_1.default.findById(groupChat._id)
                .populate("users", "name email photo")
                .populate("groupAdmin", "name email photo");
            return res.json({
                success: true,
                data: fullGroupChat,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async renameGroup(req, res, next) {
        try {
            const { chatId, groupName } = req.body;
            if (!chatId || !groupName)
                throw new Error("Chat id or group name is missing");
            const updated = await Chat_1.default.findOneAndUpdate({ _id: chatId }, {
                $set: {
                    chatName: groupName,
                },
            }, {
                new: true,
            })
                .populate("users", "name email photo")
                .populate("groupAdmin", "name email photo");
            return res.json({
                success: true,
                data: updated,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async addNewMember(req, res, next) {
        try {
            const { chatId, memberId } = req.body;
            if (!chatId || !memberId) {
                throw new Error("chatId or memberId is missing");
            }
            const updated = await Chat_1.default.findOneAndUpdate({
                _id: chatId,
                isGroupChat: true,
            }, {
                $push: { users: memberId },
            }, {
                new: true,
            })
                .populate("users", "name email phone")
                .populate("groupAdmin", "name email photo");
            return res.json({
                success: true,
                data: updated,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async removeMember(req, res, next) {
        try {
            const { chatId, memberId } = req.body;
            if (!chatId || !memberId) {
                throw new Error("chatId or memberId is missing");
            }
            const updated = await Chat_1.default.findOneAndUpdate({ _id: chatId, isGroupChat: true }, {
                $pull: { users: memberId }, // ✅ correct
            }, { new: true })
                .populate("users", "name email phone")
                .populate("groupAdmin", "name email photo");
            if (!updated)
                throw new Error("failed to remove from group");
            return res.json({
                success: true,
                data: updated,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ChatController = ChatController;
