import { Response } from 'express';
import { Database } from '../database';
import { ResponseService } from '../utils/response';
import { InterfaceAddProductCat } from '../types/productCatInterface';

export const ProductCategory = {
  // View all product categories
  viewAll: async (res: Response): Promise<void> => {
    try {
      const categories = await Database.ProductCategory.findAll({
        include: [
          {
            model: Database.Product,
            as: 'products',
            attributes: ['id', 'name'],
            required: false,
          },
          {
            model: Database.ProductSubCategory,
            as: 'subCategories',
            attributes: ['id', 'name'],
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
        return;
      }
      ResponseService({
        data: categories,
        success: true,
        status: 200,
        message: 'All Product categories successfully fetched',
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

  // Create a new product category
  create: async (data: InterfaceAddProductCat, res: Response): Promise<void> => {
    try {
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

  // View a single product category
  viewSingle: async (dataName: string, res: Response): Promise<void> => {
    try {
      const category = await Database.ProductCategory.findOne({
        where: { name: dataName },
        include: [
          {
            model: Database.ProductSubCategory,
            as: 'subCategories',
            attributes: ['id', 'name'],
            required: false,
          },
          {
            model: Database.Product,
            as: 'products',
            attributes: ['id', 'name', 'price'],
            required: false,
          },
        ],
      });
      if (!category) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Product category not found',
          res,
        });
        return;
      }
      ResponseService({
        data: category,
        success: true,
        status: 200,
        message: 'Product category successfully fetched',
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

  // Delete a product category
  delete: async (dataId: string, res: Response): Promise<void> => {
    try {
      const categoryExists = await Database.ProductCategory.findOne({
        where: { id: dataId },
      });
      if (!categoryExists) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Product category not found',
          res,
        });
        return;
      }
      const category = await Database.ProductCategory.destroy({
        where: { id: dataId },
      });
      ResponseService({
        data: category,
        success: true,
        status: 200,
        message: 'Product category successfully deleted',
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

  // Edit a product category
  update: async (data: InterfaceAddProductCat, dataId: string, res: Response): Promise<void> => {
    try {
      const categoryExists = await Database.ProductCategory.findOne({
        where: { id: dataId },
      });
      if (!categoryExists) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Product category not found',
          res,
        });
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
            id: dataId,
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
