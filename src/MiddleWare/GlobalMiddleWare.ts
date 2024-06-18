import { NextFunction, Request, Response } from "express";
import Uttils from "../Uttils/Uttils";
import usersModel from "../Models/userModel";

export default class GlobalMiddleWare {
  public static middleWareErrorCheck(validaitor: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = validaitor(req.body);
      if (result.success === false) {
        req.statusCode = 400;
        const error = result.error.format();
        throw error;
      }
      next();
    };
  }

  public static async tokenCheckMiddleWare(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { refreshToken, accessToken } = req.cookies;
      if (!refreshToken || !accessToken) {
        req.statusCode = 406;
        throw "please login first";
      }
      const decodedAccessToken = Uttils.decodeAccessToken(accessToken);
      const decodedRefreshToken = Uttils.decodeRefreshToken(refreshToken);
      if (!decodedRefreshToken) {
        req.statusCode = 400;
        throw "please login first";
      }
      const { id } = decodedRefreshToken.paylod;
      const user = await usersModel.findById({ _id: id }, "-password");
      if (!user) {
        throw "refresh token is not valid";
      }

      (req as any).user = user;
      if (decodedAccessToken) {
        req.statusCode = 400;
        throw "your toen is not expired yet";
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  public static async loginCheckMiddleWare(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { refreshToken, accessToken } = req.cookies;
      const decodedAccessToken = Uttils.decodeAccessToken(accessToken);
      const decodedRefreshToken = Uttils.decodeRefreshToken(refreshToken);
      if (!decodedAccessToken || !decodedRefreshToken) {
        req.statusCode = 401;
        throw "please login first";
      }
      const user = await usersModel.findOne(
        { _id: decodedAccessToken.paylod.id , authenticated : true},
        "-password -token"
      );
      if (!user) {
        req.statusCode = 404;
        throw "user with this refresh token notFound";
      }
      (req as any).user = user;
      next();
    } catch (error) {
      next(error);
    }
  }

  public static adminCheckMiddleWare(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = (req as any).user;
      if (!user) {
        throw "user not found please login";
      }

      if (user.role !== "ADMIN") {
        req.statusCode = 406;
        throw "only admin can access to this route";
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
