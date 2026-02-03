import { Api } from "../api/Api";

class ChatService {
  async createChat(receiverId) {
    return await Api.post("/chat/access-chat", { receiverId });
  }

  async fetchAllChats() {
    return await Api.get(`/chat/fetch-all`);
  }

  async fetchUser(userId) {
    return await Api.get(`/chat/fetchUser?userId=${userId}`);
  }
}

export const chatService = new ChatService();
