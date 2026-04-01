import Chat from "../models/Chat";
import Message from "../models/Message";
import User from "../models/User";

export class MessageController {
  static async sendMessage(req: any, res: any, next: any) {
    try {
      const { chatId, content } = req.body;
      if (!chatId || !content)
        throw new Error("chat id or message content is missing");

      const message = await new Message({
        sender: req.user.id,
        content,
        chat: chatId,
      }).save();

      let newMessage: any = await message.populate(
        "sender",
        "name email photo",
      );
      newMessage = await message.populate("chat");
      newMessage = await User.populate(message, {
        path: "chat.users",
        select: "name email photo",
      });

      await Chat.findOneAndUpdate(
        {
          _id: chatId,
        },
        {
          latestMessage: newMessage,
        },
        {
          new: true,
        },
      );

      return res.json({
        success: true,
        data: newMessage,
      });
    } catch (error) {
      next(error);
    }
  }

  static async fetchAllMessages(req: any, res: any, next: any) {
    try {
      const { chatId } = req.params || req.query;
      const messages = await Message.find({ chat: chatId })
        .populate("sender", "name email photo")
        .populate("chat");

      if (messages.length < 0)
        return res.json({ success: false, message: "no data found" });
      return res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }
}
