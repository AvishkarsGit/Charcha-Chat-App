import { Router } from "express";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { ChatController } from "../controllers/ChatController";

class ChatRouter {
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
    this.router.get(
      "/fetch-all",
      GlobalMiddleware.auth,
      ChatController.fetchAllChats,
    );

    //fetch users
    this.router.get(
      "/fetch-user",
      GlobalMiddleware.auth,
      ChatController.fetchUser,
    );
  }
  postRoutes() {
    //send message
    this.router.post(
      "/access-chat",
      GlobalMiddleware.auth,
      ChatController.createChat,
    );
    //create group chat
    this.router.post(
      "/create-group",
      GlobalMiddleware.auth,
      ChatController.createGroup,
    );
  }
  putRoutes() {}
  patchRoutes() {
    //rename group name
    this.router.patch(
      "/rename-group",
      GlobalMiddleware.auth,
      ChatController.renameGroup,
    );

    //add new member into the group
    this.router.patch(
      "/add-member",
      GlobalMiddleware.auth,
      ChatController.addNewMember,
    );

    //add new member into the group
    this.router.patch(
      "/remove-member",
      GlobalMiddleware.auth,
      ChatController.removeMember,
    );
  }
  deleteRoutes() {}
}
export default new ChatRouter().router;
