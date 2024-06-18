import * as express from "express";

import GlobalMiddleWare from "../MiddleWare/GlobalMiddleWare";
import GlobalValidaitor from "../Validators/GlobalValidaitors";
import { ProductController } from "../Controller/ProductController";
import Uttils from "../Uttils/Uttils";

class ProductRouter {
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
    this.router.get("/categoriesandproducts", ProductController.getAllCategoriesAndProducts);
    this.router.get("/products", ProductController.getAllProducts);
    this.router.get("/categories", ProductController.getAllCategory);
    this.router.get("/category/:title", ProductController.getCategory);
    this.router.get("/:slug", ProductController.getProduct);
  }

  postRoutes() {
    this.router.post(
      "",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.adminCheckMiddleWare,
      Uttils.multer.single("image"),
      GlobalMiddleWare.middleWareErrorCheck(GlobalValidaitor.product),
      ProductController.addProduct
    );
    this.router.post(
      "/category",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.adminCheckMiddleWare,
      Uttils.multer.single("image"),
      GlobalMiddleWare.middleWareErrorCheck(GlobalValidaitor.category),
      ProductController.addCategory
    );
  }

  putRoutes() {
    this.router.put(
      "/:id",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.adminCheckMiddleWare,
      GlobalMiddleWare.middleWareErrorCheck(GlobalValidaitor.editProduct),
      ProductController.editProductTitle
    );
    this.router.put(
      "/category/:id",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.adminCheckMiddleWare,
      GlobalMiddleWare.middleWareErrorCheck(GlobalValidaitor.category),
      ProductController.editCategory
    );
    this.router.put(
      "/price/:id",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.adminCheckMiddleWare,
      GlobalMiddleWare.middleWareErrorCheck(GlobalValidaitor.editPrice),
      ProductController.editProductPrice
    );
    this.router.put(
      "/count/:id",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.adminCheckMiddleWare,
      GlobalMiddleWare.middleWareErrorCheck(GlobalValidaitor.editCount),
      ProductController.editProductCount
    );
    this.router.put(
      "/time/:id",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.adminCheckMiddleWare,
      GlobalMiddleWare.middleWareErrorCheck(GlobalValidaitor.editPrepareTime),
      ProductController.editProductprepareTime
    );
  }

  deletRoutes() {
    this.router.delete(
      "/category/:id",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.adminCheckMiddleWare,
      ProductController.deleteCategory
    );
    this.router.delete(
      "/:id",
      GlobalMiddleWare.loginCheckMiddleWare,
      GlobalMiddleWare.adminCheckMiddleWare,
      ProductController.deleteProduct
    );
  }
}

export default new ProductRouter().router;
