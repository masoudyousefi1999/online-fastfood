import { NextFunction, Request, Response } from "express";
import usersModel from "../Models/userModel";
import Uttils from "../Uttils/Uttils";
import SendGmail from "../Uttils/nodemailer";
import mongoose, { isValidObjectId } from "mongoose";

export class UserController {
  public static async singupHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username, email, password } = req.body;
      const userAccesToken = req.cookies.accessToken;
      const userrfrshToken = req.cookies.refreshToken;

      if (userAccesToken && userrfrshToken) {
        const decodedAccessToken = Uttils.decodeAccessToken(userAccesToken);
        const decodedrefreshToken = Uttils.decodeRefreshToken(userrfrshToken);
        if (decodedAccessToken && decodedrefreshToken) {
          req.statusCode = 400;
          throw "you are already login";
        }
      }
      const isUserExsist = await usersModel.findOne({ email }).lean();
      if (isUserExsist) {
        req.statusCode = 406;
        throw "user already exsist";
      }
      const usersCollectionCount = await usersModel.countDocuments();
      const role = usersCollectionCount ? "USER" : "ADMIN";
      const verificationCode = Uttils.generateVerificationCode(6);
      const newUser = new usersModel({
        username,
        email,
        password,
        role,
        authenticated: true,
        code: verificationCode,
      });
      const accessToken = Uttils.generateAccessToken({ id: newUser._id });
      const refreshToken = Uttils.generateRefreshToken({ id: newUser._id });
      newUser.token = refreshToken;
      await newUser.save();
      const user = newUser.toObject();
      Reflect.deleteProperty(user, "password");
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        path: "/",
      });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        path: "/",
      });
      const sendEmailResult = new SendGmail().sendMail(
        newUser.username,
        newUser.email,
        verificationCode
      );
      return res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }

  public static async loginHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { identifire, password } = req.body;
      const userAccesToken = req.cookies.accessToken;
      const userrfrshToken = req.cookies.refreshToken;

      if (userAccesToken && userrfrshToken) {
        const decodedAccessToken = Uttils.decodeAccessToken(userAccesToken);
        const decodedrefreshToken = Uttils.decodeRefreshToken(userrfrshToken);
        if (decodedAccessToken && decodedrefreshToken) {
          req.statusCode = 400;
          throw "you are already login";
        }
      }
      const user = await usersModel
        .findOne({ $or: [{ email: identifire }, { username: identifire }] })
        .lean();
      if (!user) {
        req.statusCode = 404;
        throw "user not found";
      }
      const passwordCheckResult = await Uttils.comparePassword(
        password,
        user.password
      );
      if (!passwordCheckResult) {
        req.statusCode = 406;
        throw "username or password is wrong";
      }
      const userRefreshToken = Uttils.decodeRefreshToken(user.token);
      const accessToken = Uttils.generateAccessToken({ id: user._id });
      let refreshToken;
      if (userRefreshToken) {
        refreshToken = user.token;
      } else {
        refreshToken = Uttils.generateRefreshToken({ id: user._id });
      }

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        path: "/",
      });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        path: "/",
      });
      return res.status(200).json({ message: "Successfull" });
    } catch (error) {
      next(error);
    }
  }

  public static async generateRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userAccesToken = req.cookies.accessToken;
      const userrfrshToken = req.cookies.refreshToken;
      const decodedrefreshToken = Uttils.decodeRefreshToken(userrfrshToken);
      if (userAccesToken && userrfrshToken) {
        const decodedAccessToken = Uttils.decodeAccessToken(userAccesToken);

        if (decodedAccessToken && decodedrefreshToken) {
          req.statusCode = 400;
          throw "you are already login";
        }
      }

      if (!userrfrshToken) {
        req.statusCode = 401;
        throw "please login";
      }
      const { paylod }: any = decodedrefreshToken;
      const user = await usersModel.findById({ _id: paylod.id });
      if (!user) {
        req.statusCode = 404;
        throw "user not found please login";
      }
      const accessToken = Uttils.generateAccessToken({
        id: user._id,
      });
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      res.status(200).json({ message: "access token generated" });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = (req as any).user;
      if (!user) {
        throw "please first login";
      }
      const allUsers = await usersModel.find({}, "-password -token").lean();
      return res.status(200).json({ users: allUsers });
    } catch (error) {
      next(error);
    }
  }

  public static async getme(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  public static async editProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username, password } = req.body;
      const hashedPassword = await Uttils.hashPassword(password);
      const { id } = req.params;
      const updatedUser = await usersModel.findByIdAndUpdate(
        { _id: id },
        {
          username,
          password: hashedPassword,
        },
        {
          new: true,
        }
      );
      if (!updatedUser) {
        throw "error on updating user please try again";
      }
      const userObject = updatedUser.toObject();
      Reflect.deleteProperty(userObject, "password");
      Reflect.deleteProperty(userObject, "token");
      return res.status(200).json({ updatedUser: userObject });
    } catch (error) {
      next(error);
    }
  }

  public static async verifiEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { code } = req.body;
      const { refreshToken } = req.cookies;
      const { paylod } = Uttils.decodeRefreshToken(refreshToken) as any;
      const user = await usersModel.findById({ _id: paylod.id , authenticated : false});
      if (!user) {
        req.statusCode = 401;
        throw "please login first";
      }
      if (code !== user.code) {
        req.statusCode = 406;
        throw "verification code is not correct";
      }
      await usersModel.findByIdAndUpdate(
        { _id: user._id },
        { authenticated: true }
      );
      return res
        .status(200)
        .json({ message: "user authenticated successfully" });
    } catch (error) {
      next(error);
    }
  }

  public static async changeRole(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const isValidId = mongoose.isValidObjectId(id);
      if (!isValidId) {
        req.statusCode = 406;
        throw "user object id is not valid";
      }
      const user = await usersModel.findById({ _id: id }).lean();
      if (!user) {
        req.statusCode = 404;
        throw "user notfound";
      }
      let role: string = user.role;
      role = role === "USER" ? "ADMIN" : "USER";
      const updatedRole = await usersModel.findByIdAndUpdate(
        { _id: id },
        { role },
        {
          new: true,
          projection: {
            token: 0,
            code: 0,
            email: 0,
            password: 0,
            authenticated: 0,
            location: 0,
            createdAt: 0,
          },
        }
      );
      return res.json({ user: updatedRole });
    } catch (error) {
      next(error);
    }
  }

  public static logout(req : Request,res : Response,next : NextFunction){
   try {
    res.cookie("refreshToken", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });
    res.cookie("accessToken", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });
    res.status(200).end()
   } catch (error) {
    next(error)
   }
  }

  public static async deleteUser(req:Request,res:Response,next:NextFunction){
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        req.statusCode = 406;
        throw "userId is not valid";
      }
      const deltedUser = await usersModel.findByIdAndDelete({_id : id})
      if(!deltedUser){
        req.statusCode = 404;
        throw("user not found")
      }
      return res.status(200).json({ message: "user deleted" });
    } catch (error) {
      next(error);
    }
  }
}
