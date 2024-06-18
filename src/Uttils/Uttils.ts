import { compare, hash } from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as multer from "multer";
import * as path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products-image')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})



export default class Uttils {
  public static multer = multer({storage})
  
  public static async hashPassword(password: string) {
    const result = await hash(password, 12);
    return result;
  }

  public static async comparePassword(
    password: string,
    hashedPassword: string
  ) {
    const result = await compare(password, hashedPassword);
    return result;
  }

  public static generateAccessToken(paylod: object) {
    const token = jwt.sign({ paylod }, process.env.ACCESS_TOKEN as string, {
      expiresIn: "1h",
    });
    return token;
  }

  public static generateRefreshToken(paylod: object) {
    const token = jwt.sign({ paylod }, process.env.REFRESH_TOKEN as string, {
      expiresIn: "30d",
    });
    return token;
  }

  public static decodeAccessToken(token: string) {
    try {
      const result = jwt.verify(token, process.env.ACCESS_TOKEN as string);
      return result as {
        paylod: { id: string };
        iat: number;
        exp: number;
      };
    } catch (error) {
      return false;
    }
  }

  public static decodeRefreshToken(token: string) {
    try {
      const result = jwt.verify(token, process.env.REFRESH_TOKEN as string);
      return result as {
        paylod: { id: string };
        iat: number;
        exp: number;
      };
    } catch (error) {
      return false;
    }
  }

  public static generateVerificationCode(number: number) {
    const newCode =
      Math.floor(Math.random() * 9 * Math.pow(10, number - 1)) +
      Math.pow(10, number - 1);
    return newCode;
  }
}
