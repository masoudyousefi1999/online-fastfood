import { z } from "zod";
export default class GlobalValidaitor {
  public static singup(body: {
    username: string;
    email: string;
    password: string;
  }) {
    const userValidation = z
      .object({
        username: z
          .string()
          .min(3, "username must be at least 3 charchter")
          .max(30, "username cant be more thean 30 charchter"),
        email: z.string().min(10).max(50).email(),
        password: z
          .string()
          .min(6, "password must be at least 6 charchter")
          .max(30, "password cant be more thean 30 charchter"),
      })
      .strict("not allowed field");
    return userValidation.safeParse(body);
  }

  public static login(body: { identifire: string; password: string }) {
    const userValidation = z
      .object({
        identifire: z
          .string()
          .min(3, "username or email must be at least 3 charchter")
          .max(30, "username or email cant be more thean 30 charchter"),
        password: z
          .string()
          .min(6, "password must be at least 6 charchter")
          .max(30, "password cant be more thean 30 charchter"),
      })
      .strict("not allowed field sended");
    return userValidation.safeParse(body);
  }

  public static editProfile(body: { username: string; password: string }) {
    const userValidation = z
      .object({
        username: z
          .string()
          .min(3, "username must be at least 3 charchter")
          .max(30, "username cant be more thean 30 charchter"),
        password: z
          .string()
          .min(6, "password must be at least 6 charchter")
          .max(30, "password cant be more thean 30 charchter"),
      })
      .strict("not allowed field");
    return userValidation.safeParse(body);
  }

  public static verifyCode(body: {
    username: string;
    email: string;
    password: string;
  }) {
    const codeValidation = z
      .object({
        code: z
          .number()
          .min(4, "verification code cant be lessthan 4 digits number"),
      })
      .strict("not allowed field");
    return codeValidation.safeParse(body);
  }

  public static category(body: { title: string; urlTitle: string }) {
    const userValidation = z
      .object({
        title: z
          .string()
          .min(3, "title must be at least 3 charchter")
          .max(30, "title cant be more thean 30 charchter"),
        urlTitle: z
          .string()
          .min(3, "url-title must be at least 3 charchter")
          .max(30, "url-title cant be more thean 30 charchter"),
      })
      .strict("not allowed field");
    return userValidation.safeParse(body);
  }

  public static product(body: {
    title: string;
    count: string | number;
    description: string;
    preparationTime: string;
    image: string;
    price: string | number;
    category: string;
  }) {
    body.count = Number(body.count);
    body.price = Number(body.price);
    const userValidation = z
      .object({
        title: z
          .string()
          .min(3, "title cant be less than 3 charchter")
          .max(50, "title cant be more than 50 charchter"),
        count: z.number().min(1, "count cant be less than 1"),
        description: z
          .string()
          .min(3, "title cant be less than 3 charchter")
          .max(50, "title cant be more than 50 charchter"),
        preparationTime: z
          .string()
          .min(2, "preparationTime cant be less than 3 charchter")
          .max(3, "preparationTime cant be more than 3 charchter"),
        price: z.number().min(1, "price cant be less than 1"),
        category: z.string().min(24).max(24),
      })
      .strict("not allowed field");
    return userValidation.safeParse(body);
  }

  public static editPrice(body: { price: number }) {
    const userValidation = z
      .object({
        price: z.number().min(1, "price cant be less than 1"),
      })
      .strict("not allowed field");
    return userValidation.safeParse(body);
  }

  public static editCount(body: { price: number }) {
    const userValidation = z
      .object({
        count: z.number().min(1, "price cant be less than 1"),
      })
      .strict("not allowed field");
    return userValidation.safeParse(body);
  }
  public static editPrepareTime(body: { preparationTime: string }) {
    const userValidation = z
      .object({
        preparationTime: z
          .string()
          .min(2, "preparationTime cant be less than 2 charchter"),
      })
      .strict("not allowed field");
    return userValidation.safeParse(body);
  }

  public static editProduct(body: {
    title: string;
    description: string;
    slug: string;
  }) {
    const userValidation = z
      .object({
        title: z
          .string()
          .min(3, "title cant be less than 3 charchter")
          .max(50, "title cant be more than 50 charchter"),
        description: z
          .string()
          .min(3, "title cant be less than 3 charchter")
          .max(50, "title cant be more than 50 charchter"),
        slug: z
          .string()
          .min(3, "slug cant be less than 3 charchter")
          .max(30, "slug cant be more than 30 charchter"),
      })
      .strict("not allowed field");
    return userValidation.safeParse(body);
  }

  public static createShopingCart(body: { productId: string; count: number }) {
    const userValidation = z
      .object({
        productId: z
          .string()
          .min(24, "productId cant be less than 24 charchter")
          .max(24, "productId cant be more than 24 charchter"),
        count: z.number().gte(1),
      })
      .strict("not allowed field");
    return userValidation.safeParse(body);
  }

  public static addDescription(body: { description: string}) {
    const userValidation = z
      .object({
        description: z
          .string()
          .min(3, "description cant be less than 3 charchter")
          .max(100, "description cant be more than 100 charchter")
        
      })
      .strict("not allowed field");
    return userValidation.safeParse(body);
  }
}
