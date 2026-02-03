import { Api } from "../api/Api";

class MessageService {
  async sendMessage(content, chatId) {
    return await Api.post("/message/send", { content, chatId });
  }

  async fetchAllMessages(chatId) {
    return await Api.get(`/message/fetch-messages/${chatId}`);
  }
}

export const messageService = new MessageService();
