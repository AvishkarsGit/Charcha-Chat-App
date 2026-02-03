import { Router } from "express";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { ChatController } from "../controllers/ChatController";
import { MessageController } from "../controllers/MessageController";

class MessageRouter {
  public router: Router;
  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();
    this.patchRoutes();
    this.deleteRoutes();
  }
  getRoutes() {
    //fetch all messages
    this.router.get(
      "/fetch-messages/:chatId",
      GlobalMiddleware.auth,
      MessageController.fetchAllMessages,
    );
  }
  postRoutes() {
    //send message
    this.router.post(
      "/send",
      GlobalMiddleware.auth,
      MessageController.sendMessage,
    );
  }
  putRoutes() {}
  patchRoutes() {}
  deleteRoutes() {}
}
export default new MessageRouter().router;
