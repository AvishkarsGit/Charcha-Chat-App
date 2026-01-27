import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { GlobalMiddleware } from "../middlewares/GlobalMiddleware";
import { UserValidator } from "../validators/UserValidator";

class UserRouter {
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
    //get profile
    this.router.get(
      "/profile",
      GlobalMiddleware.auth, //check if user is loggedIn or not
      UserController.getProfile,
    );

    //request for frontend data
    this.router.get("/me", GlobalMiddleware.auth, UserController.getMyData);

    //search user
    this.router.get("/search", GlobalMiddleware.auth, UserController.getUsers);
  }

  postRoutes() {
    //register
    this.router.post(
      "/register",
      GlobalMiddleware.checkError(UserValidator.signup()), //validate by zod
      UserController.signup,
    );

    //login
    this.router.post(
      "/login",
      GlobalMiddleware.checkError(UserValidator.login()),
      UserController.login,
    );

    //send verification email
    this.router.post(
      "/send/verification/email",
      GlobalMiddleware.checkError(UserValidator.sendVerificationEmail()),
      UserController.sendVerificationEmail,
    );

    //logout route
    this.router.post("/logout", GlobalMiddleware.auth, UserController.logout);

    //refresh access Token
    this.router.post("/refreshToken", UserController.refreshToken);
  }

  putRoutes() {}

  patchRoutes() {
    this.router.patch(
      "/verifyEmail",
      GlobalMiddleware.checkError(UserValidator.verifyEmail()),
      UserController.verifyEmail,
    );

    this.router.patch(
      "/update",
      GlobalMiddleware.auth,
      GlobalMiddleware.checkError(UserValidator.profile()),
      UserController.updateProfile,
    );
  }

  deleteRoutes() {}
}
export default new UserRouter().router;
