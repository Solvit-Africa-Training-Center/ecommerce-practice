import { Response } from 'express';
import { Database } from '../database';
import { ResponseService } from '../utils/response';

export const ProductCategory = {
  viewAll: async (res: Response) => new Promise<void>(async (resolve, reject) => {
        const categories = await Database.ProductCategory.findAll({
          include: [
            {
              model: Database.Product,
              as: 'products',
              attributes: ['productId', 'name'],
              required: false,
            },
            {
              model: Database.ProductSubCategory,
              as: 'subCategories',
              attributes: ['productSubCatId', 'name'],
              required: false,
            },
          ],
        });
        if (!categories || categories.length === 0) {
          ResponseService({
            data: null,
            success: false,
            status: 404,
            message: 'Product categories not found',
            res,
          });
          resolve();
          return;
        }
        ResponseService({
          data: categories,
          success: true,
          status: 200,
          message: 'All Product categories successfully fetched',
          res,
        });
        resolve();
    }),

  create: async (data: any, res: Response) => new Promise<void>(async (resolve, reject) => {
        const { name, description } = data;
        const existingCategory = await Database.ProductCategory.findOne({
          where: { name },
        });

        if (existingCategory) {
          ResponseService({
            data: null,
            success: false,
            status: 409,
            message: 'Product category with this name already exists',
            res,
          });
          resolve();
          return;
        }
        const category = await Database.ProductCategory.create({
          name,
          description,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        ResponseService({
          data: category,
          success: true,
          status: 201,
          message: 'Product category successfully created',
          res,
        });
        resolve();
    }),

  viewSingle: async (dataName: string, res: Response) => new Promise<void>(async (resolve, reject) => {
        const category = await Database.ProductCategory.findOne({ where: { name: dataName },
          include: [
            {
              model: Database.ProductSubCategory,
              as: 'subCategories',
              attributes: ['productSubCatId', 'name'],
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
        if (!category) {
          ResponseService({
            data: null,
            success: false,
            status: 404,
            message: 'Product category not found',
            res,
          });
          resolve();
          return;
        }
        ResponseService({
          data: category,
          success: true,
          status: 200,
          message: 'Product category successfully fetched',
          res,
        });
        resolve();
    }),

  delete: (dataId: string, res: Response) => new Promise<void>(async (resolve, reject) => {
        const categoryExists = await Database.ProductCategory.findOne({
          where: { productCatId: dataId },
        });
        if (!categoryExists) {
          ResponseService({
            data: null,
            success: false,
            status: 404,
            message: 'Product category not found',
            res,
          });
          resolve();
          return;
        }
        const category = await Database.ProductCategory.destroy({
          where: { productCatId: dataId },
        });
        ResponseService({
          data: category,
          success: true,
          status: 200,
          message: 'Product category successfully deleted',
          res,
        });
        resolve();
    }),

  update: async (data: any, dataId: string, res: Response) => new Promise<void>(async (resolve, reject) => {
        const categoryExists = await Database.ProductCategory.findOne({
          where: { productCatId: dataId },
        });
        if (!categoryExists) {
          ResponseService({
            data: null,
            success: false,
            status: 404,
            message: 'Product category not found',
            res,
          });
          resolve();
          return;
        }
        const { name, description } = data;
        const updateCategory = await Database.ProductCategory.update(
          {
            name,
            description,
          },
          {
            where: {
              productCatId: dataId,
            },
          },
        );
        ResponseService({
          data: updateCategory,
          success: true,
          status: 200,
          message: 'Product category successfully updated',
          res,
        });
        resolve();
    }),
};
