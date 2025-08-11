import { Response } from 'express';
import { Database } from '../database';
import { ResponseService } from '../utils/response';
import { interfaceAddProduct } from '../types/productInterface';

export const Product = {
  // View all products
  viewAll: async (res: Response): Promise<void> => {
    try {
      const products = await Database.Product.findAll({
        include: [
          {
            model: Database.ProductCategory,
            as: 'category',
            attributes: ['productCatId', 'name', 'description'],
          },
          {
            model: Database.ProductSubCategory,
            as: 'subCategory',
            attributes: ['productSubCatId', 'name', 'productCatId'],
          },
          {
            model: Database.User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
      if (!products || products.length === 0) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Products not found',
          res,
        });
        return;
      }
      const displayedProduct = products.filter((product) => product.isAvailable === true);
      ResponseService({
        data: displayedProduct,
        success: true,
        status: 200,
        message: 'All Products successfully fetched',
        res,
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  },
  // Create a new product
  create: async (data: interfaceAddProduct, userID: string, res: Response): Promise<void> => {
    try {
      const userExists = await Database.User.findOne({ where: { id: userID } });
      if (!userExists) {
        ResponseService({
          data: null,
          success: false,
          status: 401,
          message: 'Unauthorized Access',
          res,
        });
        return;
      }
      const categoryExists = await Database.ProductCategory.findOne({
        where: { productCatId: data.productCatId },
      });
      if (!categoryExists) {
        ResponseService({
          data: null,
          success: false,
          status: 400,
          message: 'Invalid product category ID',
          res,
        });
        return;
      }
      const subCategoryExists = await Database.ProductSubCategory.findOne({
        where: { productSubCatId: data.productSubCatId },
      });
      if (!subCategoryExists) {
        ResponseService({
          data: null,
          success: false,
          status: 400,
          message: 'Invalid product subcategory ID',
          res,
        });
        return;
      }
      const image: string[] = [];
      const user: string = userExists?.id;
      const {
        name,
        description,
        price,
        stock,
        productCatId,
        productSubCatId,
        expiredAt,
        isAvailable,
      } = data;
      const product = await Database.Product.create({
        name,
        description,
        price,
        stock,
        productCatId,
        productSubCatId,
        userId: user,
        variation: Object.assign({}, data.variation),
        image,
        isAvailable,
        expiredAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      ResponseService({
        data: product,
        success: true,
        status: 201,
        message: 'Product successfully created',
        res,
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  },

  // View a single product
  viewSingle: async (dataId: string, res: Response): Promise<void> => {
    try {
      const product = await Database.Product.findOne({
        where: { productId: dataId },
        include: [
          {
            model: Database.ProductCategory,
            as: 'category',
            attributes: ['productCatId', 'name', 'description'],
          },
          {
            model: Database.ProductSubCategory,
            as: 'subCategory',
            attributes: ['productSubCatId', 'name', 'productCatId'],
          },
          {
            model: Database.User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
      if (!product) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Product not found',
          res,
        });
        return;
      }
      ResponseService({
        data: product,
        success: true,
        status: 200,
        message: 'Product successfully fetched',
        res,
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  },

  // Delete a product
  delete: async (dataId: string, res: Response): Promise<void> => {
    try {
      const productExists = await Database.Product.findOne({ where: { productId: dataId } });
      if (!productExists) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Product not found',
          res,
        });
        return;
      }
      const product = await Database.Product.destroy({ where: { productId: dataId } });
      ResponseService({
        data: product,
        success: true,
        status: 200,
        message: 'Product successfully deleted',
        res,
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  },

  // Edit a product
  update: async (
    data: interfaceAddProduct,
    dataId: string,
    userId: string,
    res: Response,
  ): Promise<void> => {
    try {
      const userExists = await Database.User.findOne({ where: { id: userId } });
      if (!userExists) {
        ResponseService({
          data: null,
          success: false,
          status: 401,
          message: 'Unauthorized Access',
          res,
        });
        return;
      }
      const productExists = await Database.Product.findOne({ where: { productId: dataId } });
      if (!productExists) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Product not found',
          res,
        });
        return;
      }
      const image: string[] = [];
      const user: string = userExists?.id;
      const {
        name,
        description,
        price,
        stock,
        productCatId,
        productSubCatId,
        isAvailable,
        expiredAt,
      } = data;
      const updateProduct = await Database.Product.update(
        {
          name,
          description,
          price,
          stock,
          productCatId,
          productSubCatId,
          userId: user,
          variation: Object.assign({}, data.variation),
          image,
          isAvailable,
          expiredAt,
        },
        {
          where: {
            productId: dataId,
          },
        },
      );
      ResponseService({
        data: updateProduct,
        success: true,
        status: 200,
        message: 'Product successfully updated',
        res,
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  },
};
