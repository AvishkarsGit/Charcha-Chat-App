"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
class MessageController {
    static async sendMessage(req, res, next) {
        try {
            const { chatId, content } = req.body;
            if (!chatId || !content)
                throw new Error("chat id or message content is missing");
            const message = await new Message_1.default({
                sender: req.user.id,
                content,
                chat: chatId,
            }).save();
            let newMessage = await message.populate("sender", "name email photo");
            newMessage = await message.populate("chat");
            newMessage = await User_1.default.populate(message, {
                path: "chat.users",
                select: "name email photo",
            });
            await Chat_1.default.findOneAndUpdate({
                _id: chatId,
            }, {
                latestMessage: newMessage,
            }, {
                new: true,
            });
            return res.json({
                success: true,
                data: newMessage,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async fetchAllMessages(req, res, next) {
        try {
            const { chatId } = req.params || req.query;
            const messages = await Message_1.default.find({ chat: chatId })
                .populate("sender", "name email photo")
                .populate("chat");
            if (messages.length < 0)
                return res.json({ success: false, message: "no data found" });
            return res.json({
                success: true,
                data: messages,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MessageController = MessageController;
