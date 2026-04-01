"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const GlobalMiddleware_1 = require("../middlewares/GlobalMiddleware");
const UserValidator_1 = require("../validators/UserValidator");
class UserRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.putRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        //get profile
        this.router.get("/profile", GlobalMiddleware_1.GlobalMiddleware.auth, //check if user is loggedIn or not
        UserController_1.UserController.getProfile);
        //request for frontend data
        this.router.get("/me", GlobalMiddleware_1.GlobalMiddleware.auth, UserController_1.UserController.getMyData);
        //search user
        this.router.get("/search", GlobalMiddleware_1.GlobalMiddleware.auth, UserController_1.UserController.getUsers);
    }
    postRoutes() {
        //register
        this.router.post("/register", GlobalMiddleware_1.GlobalMiddleware.checkError(UserValidator_1.UserValidator.signup()), //validate by zod
        UserController_1.UserController.signup);
        //login
        this.router.post("/login", GlobalMiddleware_1.GlobalMiddleware.checkError(UserValidator_1.UserValidator.login()), UserController_1.UserController.login);
        //send verification email
        this.router.post("/send/verification/email", GlobalMiddleware_1.GlobalMiddleware.checkError(UserValidator_1.UserValidator.sendVerificationEmail()), UserController_1.UserController.sendVerificationEmail);
        //logout route
        this.router.post("/logout", GlobalMiddleware_1.GlobalMiddleware.auth, UserController_1.UserController.logout);
        //refresh access Token
        this.router.post("/refreshToken", UserController_1.UserController.refreshToken);
    }
    putRoutes() { }
    patchRoutes() {
        this.router.patch("/verifyEmail", GlobalMiddleware_1.GlobalMiddleware.checkError(UserValidator_1.UserValidator.verifyEmail()), UserController_1.UserController.verifyEmail);
        this.router.patch("/update", GlobalMiddleware_1.GlobalMiddleware.auth, GlobalMiddleware_1.GlobalMiddleware.checkError(UserValidator_1.UserValidator.profile()), UserController_1.UserController.updateProfile);
    }
    deleteRoutes() { }
}
exports.default = new UserRouter().router;
