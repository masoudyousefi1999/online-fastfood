import * as express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import UserRouter from "./Routes/UserRouter";
import ProductRouter from "./Routes/ProductRouter";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import ShopingCartRouter from "./Routes/ShopingCartRouter";
import * as cookieParser from "cookie-parser";
class Server {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.setConfig();
  }

  setConfig() {
    dotenv.config();
    this.allowCors();
    this.cookieParser();
    this.bodyParser();
    this.connectToMongoDb();
    this.setRoutes();
    this.error404Handler();
    this.appErrorHandler();
  }

  async connectToMongoDb() {
    if (mongoose.connections[0].readyState) {
      return false;
    }
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      console.log("connected to mongodb");
    } catch (error) {
      console.log("error connecting to mongodb =>", error);
    }
  }

  bodyParser() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  cookieParser() {
    this.app.use(cookieParser());
  }

  allowCors() {
    this.app.use(
      cors({
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
      })
    );
  }

  setRoutes() {
    this.app.use("/uploads", express.static("uploads"));
    this.app.use("/api/user", UserRouter);
    this.app.use("/api/product", ProductRouter);
    this.app.use("/api/cart", ShopingCartRouter);
  }

  error404Handler() {
    this.app.use((req, res, next) => {
      return res.status(404).json({ message: "not found" });
    });
  }

  appErrorHandler() {
    this.app.use(
      (
        error: express.ErrorRequestHandler,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        const statusCode = req.statusCode || 500;
        const errorMessage =
          Object.keys(error).length !== 0
            ? error
            : "server side error please try again";
        return res.status(statusCode).json({ error: errorMessage });
      }
    );
  }
}

export default Server;
