"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GlobalMiddleware_1 = require("../middlewares/GlobalMiddleware");
const ChatController_1 = require("../controllers/ChatController");
class ChatRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.putRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get("/fetch-all", GlobalMiddleware_1.GlobalMiddleware.auth, ChatController_1.ChatController.fetchAllChats);
        //fetch users
        this.router.get("/fetch-user", GlobalMiddleware_1.GlobalMiddleware.auth, ChatController_1.ChatController.fetchUser);
    }
    postRoutes() {
        //send message
        this.router.post("/access-chat", GlobalMiddleware_1.GlobalMiddleware.auth, ChatController_1.ChatController.createChat);
        //create group chat
        this.router.post("/create-group", GlobalMiddleware_1.GlobalMiddleware.auth, ChatController_1.ChatController.createGroup);
    }
    putRoutes() { }
    patchRoutes() {
        //rename group name
        this.router.patch("/rename-group", GlobalMiddleware_1.GlobalMiddleware.auth, ChatController_1.ChatController.renameGroup);
        //add new member into the group
        this.router.patch("/add-member", GlobalMiddleware_1.GlobalMiddleware.auth, ChatController_1.ChatController.addNewMember);
        //remove member from the group
        this.router.patch("/remove-member", GlobalMiddleware_1.GlobalMiddleware.auth, ChatController_1.ChatController.removeMember);
    }
    deleteRoutes() { }
}
exports.default = new ChatRouter().router;
