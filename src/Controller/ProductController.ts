import { NextFunction, Request, Response } from "express";
import categoriesModel from "../Models/category";
import productsModel from "../Models/product";
import mongoose, { isValidObjectId } from "mongoose";
import slugify from "slugify";

export class ProductController {
  public static async addCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, urlTitle } = req.body;
      const image = req.file?.path;
      const category = await categoriesModel.create({ title, urlTitle, image });
      return res.status(201).json({ category });
    } catch (error) {
      next(error);
    }
  }

  public static async addProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const image = req.file?.path;
      const { price, count, title, preparationTime, description, category } =
        req.body;
      const isObjectId = mongoose.isValidObjectId(category);
      if (!isObjectId) {
        req.statusCode = 406;
        throw "category objectId is not valid";
      }
      const slug = slugify(title);
      const product = await productsModel.create({
        price,
        count,
        title,
        preparationTime,
        description,
        image,
        category,
        slug,
      });
      return res.status(201).json({ product });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const products = await productsModel.find({ count: { $gt: 0 } }).lean();
      return res.status(200).json({ products });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categories = await categoriesModel.find({}).lean();
      return res.status(200).json({ categories });
    } catch (error) {
      next(error);
    }
  }

  public static async getCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const urlTitle = req.params.title;
      const category = await categoriesModel
        .findOne({ urlTitle })
        .populate("products")
        .lean();
      if (!category) {
        req.statusCode = 404;
        throw "category notfound or category urlTitle is wrong";
      }
      return res.status(200).json({ category });
    } catch (error) {
      next(error);
    }
  }

  public static async getProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { slug } = req.params;
      const product = await productsModel
        .findOne({ slug })
        .populate("category", "title urlTitle")
        .lean();
      if (!product) {
        req.statusCode = 404;
        throw "product notfound or product urlTitle is wrong";
      }
      const similarProducts = await productsModel
        .find({ _id: { $ne: product._id }, category: product.category })
        .lean();
      return res.status(200).json({ product, similarProducts });
    } catch (error) {
      next(error);
    }
  }

  public static async editCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { title, urlTitle } = req.body;
      const isValidObjectId = mongoose.isValidObjectId(id);
      if (!isValidObjectId) {
        req.statusCode = 406;
        throw "category object id is not valid";
      }
      const category = await categoriesModel.findByIdAndUpdate(
        { _id: id },
        {
          title,
          urlTitle,
        },
        { new: true }
      );
      if (!category) {
        req.statusCode = 404;
        throw "product not found";
      }
      return res.status(200).json({ updatedCategory: category });
    } catch (error) {
      next(error);
    }
  }

  public static async editProductPrice(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { price } = req.body;
      const isValidObjectId = mongoose.isValidObjectId(id);
      if (!isValidObjectId) {
        req.statusCode = 406;
        throw "product object id is not valid";
      }
      const product = await productsModel.findByIdAndUpdate(
        { _id: id },
        {
          price,
        },
        { new: true }
      );
      if (!product) {
        req.statusCode = 404;
        throw "product not found";
      }
      return res.status(200).json({ updatedProduct: product });
    } catch (error) {
      next(error);
    }
  }

  public static async editProductCount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { count } = req.body;
      const isValidObjectId = mongoose.isValidObjectId(id);
      if (!isValidObjectId) {
        req.statusCode = 406;
        throw "product object id is not valid";
      }
      const product = await productsModel.findByIdAndUpdate(
        { _id: id },
        {
          count,
        },
        { new: true }
      );
      if (!product) {
        req.statusCode = 404;
        throw "product not found";
      }
      return res.status(200).json({ updatedProduct: product });
    } catch (error) {
      next(error);
    }
  }

  public static async editProductprepareTime(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { preparationTime } = req.body;
      const isValidObjectId = mongoose.isValidObjectId(id);
      if (!isValidObjectId) {
        req.statusCode = 406;
        throw "product object id is not valid";
      }
      const product = await productsModel.findByIdAndUpdate(
        { _id: id },
        {
          preparationTime,
        },
        { new: true }
      );
      if (!product) {
        req.statusCode = 404;
        throw "product not found";
      }
      return res.status(200).json({ updatedProduct: product });
    } catch (error) {
      next(error);
    }
  }

  public static async editProductTitle(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { title, slug, description } = req.body;
      const isValidObjectId = mongoose.isValidObjectId(id);
      if (!isValidObjectId) {
        req.statusCode = 406;
        throw "product object id is not valid";
      }
      const product = await productsModel.findByIdAndUpdate(
        { _id: id },
        {
          title,
          slug,
          description,
        },
        { new: true, projection: { title: 0 } }
      );
      if (!product) {
        req.statusCode = 404;
        throw "product not found";
      }
      return res.status(200).json({ updatedProduct: product });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllCategoriesAndProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const allCategories = await categoriesModel
      .find({})
      .populate("products")
      .lean();
    const result = allCategories.filter((category: any) => {
      if (category.products.length > 0) {
        return category;
      }
    });
    return res.json({ allCategories: result });
  }

  public static async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        req.statusCode = 406;
        throw "categoryId is not valid";
      }
      const deletedCategory = await categoriesModel.findByIdAndDelete({_id : id})
      if(!deletedCategory){
        req.statusCode = 404;
        throw("category not found")
      }
      return res.status(200).json({ message: "category deleted" });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteProduct (req : Request,res : Response,next : NextFunction){
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        req.statusCode = 406;
        throw "productId is not valid";
      }
      const deletedProduct = await productsModel.findByIdAndDelete({_id : id})
      if(!deletedProduct){
        req.statusCode = 404;
        throw("product not found")
      }
      return res.status(200).json({ message: "product deleted" });
    } catch (error) {
      next(error);
    }
  }
}
