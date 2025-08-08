import { Response } from 'express';
import { Database } from '../database';
import { ResponseService } from '../utils/response';

export const Product = {
  viewAll: async (res: Response) => new Promise<void>(async (resolve, reject) => {
      try {
        const products = await Database.Product.findAll({
          include: [
            {
              model: Database.ProductCategory,
              as: 'category',
              attributes: ['productCatId', 'name', 'description']
            },
            {
              model: Database.ProductSubCategory,
              as: 'subCategory',
              attributes: ['productSubCatId', 'name', 'productCatId']
            },
            {
              model: Database.User,
              as: 'user',
              attributes: ['id', 'name', 'email'] // Adjust based on your User model
            }
          ]
        });
        if (!products) {
          ResponseService({
            data: null,
            success: false,
            status: 404,
            message: 'Products not found',
            res,
          });
          resolve();
          return;
        }
        ResponseService({
          data: products,
          success: true,
          status: 200,
          message: 'All Products successfully fetched',
          res,
        });
        resolve();
      } catch (err) {
        console.error('Database retrieve error:', err as Error);
        ResponseService({
          data: null,
          success: false,
          status: 500,
          message: 'Internal server error',
          res,
        });
        resolve();
      }
    }),

  create: async (data: any, userID: string, res: Response) => new Promise<void>(async (resolve, reject) => {
      try {
        const userExists = await Database.User.findOne({ where: { id:userID }});
        if (!userExists) {
          ResponseService({
            data: null,
            success: false,
            status: 401,
            message: 'Unauthorized Access',
            res,
          });
          resolve();
          return;
        }
        const categoryExists = await Database.ProductCategory.findOne({ 
          where: { productCatId: data.productCatId }
        });
        if (!categoryExists) {
          ResponseService({
            data: null,
            success: false,
            status: 400,
            message: 'Invalid product category ID',
            res,
          });
          resolve();
          return;
        }
        const subCategoryExists = await Database.ProductSubCategory.findOne({ 
          where: { productSubCatId: data.productSubCatId }
        });
        if (!subCategoryExists) {
          ResponseService({
            data: null,
            success: false,
            status: 400,
            message: 'Invalid product subcategory ID',
            res,
          });
          resolve();
          return;
        }
        const image: string[] = [];
        const user: string = userExists?.id;
        const { name, description, price, stock, productCatId, productSubCatId, rating } = data;
        const product = await Database.Product.create({
          name,
          description,
          price,
          stock,
          productCatId,
          productSubCatId,
          userId:user,
          variation: Object.assign({}, data.variation),
          rating,
          image,
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
        resolve();
      } catch (err) {
        console.error('Database insert error:', err as Error);
        ResponseService({
          data: null,
          success: false,
          status: 500,
          message: 'Internal server error',
          res,
        });
        resolve();
      }
    }),

  viewSingle: async (dataId: string, res: Response) => new Promise<void>(async (resolve, reject) => {
      try {
        const product = await Database.Product.findOne({ 
          where: { productId: dataId },
          include: [
            {
              model: Database.ProductCategory,
              as: 'category',
              attributes: ['productCatId', 'name', 'description']
            },
            {
              model: Database.ProductSubCategory,
              as: 'subCategory',
              attributes: ['productSubCatId', 'name', 'productCatId']
            },
            {
              model: Database.User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        });
        if (!product) {
          ResponseService({
            data: null,
            success: false,
            status: 404,
            message: 'Product not found',
            res,
          });
          resolve();
          return;
        }
        ResponseService({
          data: product,
          success: true,
          status: 200,
          message: 'Product successfully fetched',
          res,
        });
        resolve();
      } catch (err) {
        console.error('Database retrieve error:', err as Error);
        ResponseService({
          data: null,
          success: false,
          status: 500,
          message: 'Internal server error',
          res,
        });
        resolve();
      }
    }),

  delete: (dataId: string, userId: string, res: Response) => new Promise<void>(async (resolve, reject) => {
      try {
        const user = await Database.User.findOne({ where: { id: userId } });
        if (!user) {
          ResponseService({
            data: null,
            success: false,
            status: 401,
            message: 'Unauthorized Access',
            res,
          });
          resolve();
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
          resolve();
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
        resolve();
      } catch (err) {
        console.error('Database retrieve error:', err as Error);
        ResponseService({
          data: null,
          success: false,
          status: 500,
          message: 'Internal server error',
          res,
        });
        resolve();
      }
    }),

  update: async (data: any, dataId: string, userId: string, res: Response) => new Promise<void>(async (resolve, reject) => {
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
          resolve();
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
          resolve();
          return;
        }
        const image: string[] = [];
        const user: string = userExists?.id;
        const { name, description, price, stock, productCatId, productSubCatId, rating } = data;
        const updateProduct = await Database.Product.update(
          {
            name,
            description,
            price,
            stock,
            productCatId,
            productSubCatId,
            userId:user,
            variation: Object.assign({}, data.variation),
            rating,
            image,
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
        resolve();
      } catch (err) {
        console.error('Database retrieve error:', err as Error);
        ResponseService({
          data: null,
          success: false,
          status: 500,
          message: 'Internal server error',
          res,
        });
        resolve();
      }
    }),
};
