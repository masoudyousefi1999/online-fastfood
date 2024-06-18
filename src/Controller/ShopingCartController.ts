import { NextFunction, Request, Response } from "express";
import productsModel from "../Models/product";
import mongoose from "mongoose";
import shopingCartsModel from "../Models/shopingCart";

export default class ShopingCartController {
  public static async addProductToCart(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { productId, count } = req.body;
      const isValidProductId = mongoose.isValidObjectId(productId);
      if (!isValidProductId) {
        req.statusCode = 406;
        throw "product object id is not valid";
      }
      const product = await productsModel.findById({ _id: productId });
      if (!product) {
        req.statusCode = 404;
        throw "product not found";
      }
      const productPrice = product.price * count;

      const userShopingCart = await shopingCartsModel.findOne({
        user: (req as any).user._id,
        paid: false,
      });
      if (!userShopingCart) {
        const shopingCart = await shopingCartsModel.create({
          user: (req as any).user._id,
          totalPrice: productPrice,
          items: { product: productId, count, price: productPrice },
        });
        return res.status(201).json({ shopingCart });
      }
      let totalPrice: number = 0;
      const shopingCartObject = userShopingCart.toObject();
      const findIndx = shopingCartObject.items.findIndex((item) => {
        return (item.product as any) == productId;
      });
      let items = shopingCartObject.items;
      if (findIndx === -1) {
        items.push({ product: productId, count, price: productPrice });
        shopingCartObject.items.map((item) => {
          totalPrice += item.price;
        });
        const updateShopingCart = await shopingCartsModel.findOneAndUpdate(
          { user: (req as any).user._id, paid: false },
          { items, totalPrice },
          { new: true }
        );
        return res.json({ updateShopingCart });
      }
      const prevItemPrice = items[findIndx].price;
      items[findIndx].count += count;
      items[findIndx].price = product.price * items[findIndx].count;
      const addedCartPrice = items[findIndx].price - prevItemPrice;
      const updatedTotalPrice = shopingCartObject.totalPrice + addedCartPrice;

      const updateShopingCart = await shopingCartsModel.findOneAndUpdate(
        { user: (req as any).user._id, paid: false },
        { items, totalPrice: updatedTotalPrice },
        { new: true }
      );
      return res.status(200).json({ updateShopingCart });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteItemFromCart(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const isValidItemId = mongoose.isValidObjectId(id);
      if (!isValidItemId) {
        req.statusCode = 406;
        throw "product object id is not valid";
      }
      const userCart = await shopingCartsModel
        .findOne({
          user: (req as any).user._id,
          paid: false,
        })
        .lean();
      if (!userCart) {
        req.statusCode = 404;
        throw "product not found";
      }
      let removedItemPrice: number = 0;
      const result = userCart.items.filter((product) => {
        if (product._id?.toString() == id) {
          removedItemPrice = product.price;
        }
        return (product._id as any) != id;
      });
      if (result.length === userCart.items.length) {
        req.statusCode = 404;
        throw "item not found on your cart";
      }
      let totalPrice = userCart.totalPrice - removedItemPrice;
      const updatedCart = await shopingCartsModel.findOneAndUpdate(
        { user: (req as any).user._id, paid: false },
        { totalPrice, items: result },
        { new: true }
      );
      if (updatedCart?.items.length === 0) {
        await shopingCartsModel.findOneAndDelete({
          user: (req as any).user._id,
        });
        return res.status(200).json({ message: "user shoping cart removed" });
      }
      return res.json({ updatedCart });
    } catch (error) {
      next(error);
    }
  }

  public static async decreaseProductCountFromCart(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const isValidItemId = mongoose.isValidObjectId(id);
      if (!isValidItemId) {
        req.statusCode = 406;
        throw "product object id is not valid";
      }
      const userCart = await shopingCartsModel
        .findOne({
          user: (req as any).user._id,
          paid: false,
        })
        .lean();
      if (!userCart) {
        req.statusCode = 404;
        throw "product not found";
      }

      const currentItemIndex = userCart.items.findIndex((item) => {
        return (item._id as any) == id;
      });
      if (currentItemIndex === -1) {
        req.statusCode = 404;
        throw "product item not found";
      }
      const prevPrice = userCart.items[currentItemIndex].price;
      const productPrice = prevPrice / userCart.items[currentItemIndex].count;
      const itemCount = userCart.items[currentItemIndex].count - 1;
      userCart.items[currentItemIndex].count = itemCount;
      const updatedPrice = itemCount * productPrice;
      userCart.items[currentItemIndex].price = updatedPrice;
      const subtractedFromTotalPrice = prevPrice - updatedPrice;
      const totalPrice = userCart.totalPrice - subtractedFromTotalPrice;
      if (itemCount < 1) {
        const newItems = userCart.items.filter((item) => {
          return (item._id as any) != id;
        });
        if (newItems.length === 0) {
          await shopingCartsModel.findOneAndDelete({
            user: (req as any).user._id,
            paid: false,
          });
          return res.status(200).json({ message: "user shoping cart removed" });
        }
        const updatedUserCart = await shopingCartsModel.findOneAndUpdate(
          { user: (req as any).user._id, paid: false },
          {
            items: newItems,
            totalPrice,
          },
          { new: true }
        );
        return res.status(200).json({ updatedUserCart });
      }

      const updatedUserCart = await shopingCartsModel.findOneAndUpdate(
        { user: (req as any).user._id, paid: false },
        {
          items: userCart.items,
          totalPrice,
        },
        { new: true }
      );
      return res.status(200).json({ updatedUserCart });
    } catch (error) {
      next(error);
    }
  }

  public static async increaseProductCountFromCart(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const isValidItemId = mongoose.isValidObjectId(id);
      if (!isValidItemId) {
        req.statusCode = 406;
        throw "product object id is not valid";
      }
      const userCart = await shopingCartsModel
        .findOne({
          user: (req as any).user._id,
          paid: false,
        })
        .lean();
      if (!userCart) {
        req.statusCode = 404;
        throw "product not found";
      }

      const currentItemIndex = userCart.items.findIndex((item) => {
        return (item._id as any) == id;
      });
      if (currentItemIndex === -1) {
        req.statusCode = 404;
        throw "product item not found";
      }
      const prevPrice = userCart.items[currentItemIndex].price; // 2 => 220
      const productPrice = prevPrice / userCart.items[currentItemIndex].count; // 110
      const itemCount = userCart.items[currentItemIndex].count + 1; // 3 => 330
      userCart.items[currentItemIndex].count = itemCount;
      const updatedPrice = itemCount * productPrice; // 3 * 110
      userCart.items[currentItemIndex].price = updatedPrice;
      const subtractedFromTotalPrice = updatedPrice - prevPrice; // 220 - 330 = 110
      const totalPrice = userCart.totalPrice + subtractedFromTotalPrice; // 220 + 110 = 330
      const updatedUserCart = await shopingCartsModel.findOneAndUpdate(
        { user: (req as any).user._id, paid: false },
        {
          items: userCart.items,
          totalPrice,
        },
        { new: true }
      );
      return res.status(200).json({ updatedUserCart });
    } catch (error) {
      next(error);
    }
  }

  public static async addDescriptionToOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { description } = req.body;
      const userCart = await shopingCartsModel.findOneAndUpdate(
        { user: (req as any).user._id, paid: false },
        {
          description,
        },
        { new: true }
      );
      if (!userCart) {
        req.statusCode = 404;
        throw "user have no shopingCart yet";
      }

      return res.status(200).json({ userCart });
    } catch (error) {
      next(error);
    }
  }

  public static async paidInPlace(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userCart = await shopingCartsModel.findOneAndUpdate(
        { user: (req as any).user._id, paid: false },
        {
          paid: true,
        },
        { new: true }
      );
      if (!userCart) {
        req.statusCode = 404;
        throw "user have no shopingCart yet";
      }

      return res.status(200).json({ userCart });
    } catch (error) {
      next(error);
    }
  }

  public static async getUserCart(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userCart = await shopingCartsModel
        .findOne({ user: (req as any).user._id, paid: false })
        .populate("items.product", "title image preparationTime")
        .populate("user","username")
        .lean();
      if (!userCart) {
        req.statusCode = 404;
        throw "user have no shopingCart yet";
      }

      return res.status(200).json({ userCart });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllCarts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userCart = await shopingCartsModel
        .find({ paid: false })
        .populate("items.product", "title image preparationTime")
        .populate("user", "username")
        .lean();
      if (!userCart) {
        req.statusCode = 404;
        throw "user have no shopingCart yet";
      }

      return res.status(200).json({ userCart });
    } catch (error) {
      next(error);
    }
  }
}
