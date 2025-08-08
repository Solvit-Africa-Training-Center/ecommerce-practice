import { Response } from 'express';
import { Database } from '../database';
import { ResponseService } from '../utils/response';

export const ProductSubCategory = {
  viewAll: async (res: Response) => new Promise<void>(async (resolve, reject) => {
      try {
        const subCategories = await Database.ProductSubCategory.findAll({
          include: [
            {
              model: Database.ProductCategory,
              as: 'category',
              attributes: ['productCatId', 'name', 'description'],
              required: false,
            },
            {
              model: Database.Product,
              as: 'products',
              attributes: ['productId', 'name', 'price'],
              required: false,
            }
          ]
        });
        if (!subCategories || subCategories.length === 0) {
          ResponseService({
            data: null,
            success: false,
            status: 404,
            message: 'Product subCategories not found',
            res,
          });
          resolve();
          return;
        }
        ResponseService({
          data: subCategories,
          success: true,
          status: 200,
          message: 'All Product subCategories successfully fetched',
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

  create: async (data: any, userId: string, res: Response) => new Promise<void>(async (resolve, reject) => {
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
        const { name, productCatId } = data;
        const existingCategory = await Database.ProductSubCategory.findOne({
          where: { name: data.name },
        });

        if (existingCategory) {
          ResponseService({
            data: null,
            success: false,
            status: 409,
            message: 'Product sub-category with this name already exists',
            res,
          });
          resolve();
          return;
        }
        const subcategory = await Database.ProductSubCategory.create({
          name,
          productCatId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        ResponseService({
          data: subcategory,
          success: true,
          status: 201,
          message: 'Product sub-category successfully created',
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

  viewSingle: async (dataName: string, res: Response) => new Promise<void>(async (resolve, reject) => {
      try {
        const subCategory = await Database.ProductSubCategory.findOne({ 
          where: { name: dataName },
          include: [
            {
              model: Database.ProductCategory,
              as: 'category',
              attributes: ['productCatId', 'name', 'description'],
              required: false,
            },
            {
              model: Database.Product,
              as: 'products',
              attributes: ['productId', 'name', 'price'],
              required: false,
            }
          ],
          raw:true
        });
        if (!subCategory) {
          ResponseService({
            data: null,
            success: false,
            status: 404,
            message: 'Product sub-category not found',
            res,
          });
          resolve();
          return;
        }
        ResponseService({
          data: subCategory,
          success: true,
          status: 200,
          message: 'Product sub-category successfully fetched',
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
        const categoryExists = await Database.ProductSubCategory.findOne({
          where: { productSubCatId: dataId },
        });
        if (!categoryExists) {
          ResponseService({
            data: null,
            success: false,
            status: 404,
            message: 'Product sub-category not found',
            res,
          });
          resolve();
          return;
        }
        const subcategory = await Database.ProductSubCategory.destroy({
          where: { productCatId: dataId },
        });
        ResponseService({
          data: subcategory,
          success: true,
          status: 200,
          message: 'Product sub-category successfully deleted',
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

        const categoryExists = await Database.ProductSubCategory.findOne({
          where: { productSubCatId: dataId },
        });
        if (!categoryExists) {
          ResponseService({
            data: null,
            success: false,
            status: 404,
            message: 'Product sub-category not found',
            res,
          });
          resolve();
          return;
        }
        const { name, productCatId} = data;
        const updateSubCategory = await Database.ProductSubCategory.update(
          {
            name,
            productCatId,
          },
          {
            where: {
              productSubCatId: dataId,
            },
          },
        );
        ResponseService({
          data: updateSubCategory,
          success: true,
          status: 200,
          message: 'Product sub-category successfully updated',
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
