import * as express from "express";
import GlobalMiddleWare from "../MiddleWare/GlobalMiddleWare";
import GlobalValidaitor from "../Validators/GlobalValidaitors";
import ShopingCartController from "../Controller/ShopingCartController";

class ShopingCartRouter {
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
      "",
      GlobalMiddleWare.loginCheckMiddleWare,
      ShopingCartController.getUserCart
    );

    this.router.get(
      "/getall",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.adminCheckMiddleWare,
      ShopingCartController.getAllCarts
    );
  }

  postRoutes() {
    this.router.post(
      "",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.middleWareErrorCheck(GlobalValidaitor.createShopingCart),
      ShopingCartController.addProductToCart
    );
  }

  putRoutes() {
    this.router.put(
      "/description",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.middleWareErrorCheck(GlobalValidaitor.addDescription),
      ShopingCartController.addDescriptionToOrder
    );

    this.router.put(
      "/paid",
      GlobalMiddleWare.loginCheckMiddleWare,
      ShopingCartController.paidInPlace
    );

    this.router.put(
      "/decrease/:id",
      GlobalMiddleWare.loginCheckMiddleWare,
      ShopingCartController.decreaseProductCountFromCart
    );

    this.router.put(
      "/increase/:id",
      GlobalMiddleWare.loginCheckMiddleWare,
      ShopingCartController.increaseProductCountFromCart
    );
  }

  deletRoutes() {
    this.router.delete(
      "/:id",
      GlobalMiddleWare.loginCheckMiddleWare,
      ShopingCartController.deleteItemFromCart
    );
  }
}

export default new ShopingCartRouter().router;
