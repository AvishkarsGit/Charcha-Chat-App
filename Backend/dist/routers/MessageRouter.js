"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GlobalMiddleware_1 = require("../middlewares/GlobalMiddleware");
const MessageController_1 = require("../controllers/MessageController");
class MessageRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.putRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        //fetch all messages
        this.router.get("/fetch-messages/:chatId", GlobalMiddleware_1.GlobalMiddleware.auth, MessageController_1.MessageController.fetchAllMessages);
    }
    postRoutes() {
        //send message
        this.router.post("/send", GlobalMiddleware_1.GlobalMiddleware.auth, MessageController_1.MessageController.sendMessage);
    }
    putRoutes() { }
    patchRoutes() { }
    deleteRoutes() { }
}
exports.default = new MessageRouter().router;
