import * as express from "express";
import { UserController } from "../Controller/UserController";
import GlobalMiddleWare from "../MiddleWare/GlobalMiddleWare";
import GlobalValidaitor from "../Validators/GlobalValidaitors";

class UserRouter {
  public router: express.Router;
  constructor() {
    this.router = express.Router();
    this.setRoutes();
  }

  setRoutes() {
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();
    this.deletRoutes();
  }

  getRoutes() {
    this.router.get(
      "/getall",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.adminCheckMiddleWare,
      UserController.getAllUsers
    );
    this.router.get(
      "/me",
      GlobalMiddleWare.loginCheckMiddleWare,
      UserController.getme
    );
    this.router.get(
      "/logout",
      GlobalMiddleWare.loginCheckMiddleWare,
      UserController.logout
    );
  }

  postRoutes() {
    this.router.post("/refreshtoken", UserController.generateRefreshToken);
    this.router.post(
      "/signup",
      GlobalMiddleWare.middleWareErrorCheck(GlobalValidaitor.singup),
      UserController.singupHandler
    );
    this.router.post(
      "/login",
      GlobalMiddleWare.middleWareErrorCheck(GlobalValidaitor.login),
      UserController.loginHandler
    );
  }

  putRoutes() {
    this.router.put(
      "/verify",
      GlobalMiddleWare.middleWareErrorCheck(GlobalValidaitor.verifyCode),
      UserController.verifiEmail
    );
    this.router.put(
      "/role/:id",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.adminCheckMiddleWare,
      UserController.changeRole
    );
    this.router.put(
      "/:id",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.middleWareErrorCheck(GlobalValidaitor.editProfile),
      UserController.editProfile
    );
  }

  deletRoutes() {
    this.router.delete(
      "/:id",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.adminCheckMiddleWare,
      UserController.deleteUser
    );
  }
}

export default new UserRouter().router;
