import { Response } from 'express';
import { Database } from '../database';
import { ResponseService } from '../utils/response';


export const Product = {
  viewAll: async (res: Response) => new Promise<void>(async (resolve, reject) => {
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
              attributes: ['id', 'name', 'email'] 
            }
          ]
        });
        if (!products || products.length === 0) {
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
        const displayedProduct = products.filter((product) => product.isAvailable === true);
        ResponseService({
          data: displayedProduct,
          success: true,
          status: 200,
          message: 'All Products successfully fetched',
          res,
        });
        resolve();
    }),

  create: async (data: any, userID: string, res: Response) => new Promise<void>(async (resolve, reject) => {
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
        const { name, description, price, stock, productCatId, productSubCatId, expiredAt, isAvailable} = data;
        const product = await Database.Product.create({
          name,
          description,
          price,
          stock,
          productCatId,
          productSubCatId,
          userId:user,
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
        resolve();
    }),

  viewSingle: async (dataId: string, res: Response) => new Promise<void>(async (resolve, reject) => {
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
    }),

  delete: (dataId: string, res: Response) => new Promise<void>(async (resolve, reject) => {
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
    }),

  update: async (data: any, dataId: string, userId: string, res: Response) => new Promise<void>(async (resolve, reject) => {
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
        const { name, description, price, stock, productCatId, productSubCatId, isAvailable, expiredAt} = data;
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
            image,
            isAvailable,
            expiredAt
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
    }),
};
