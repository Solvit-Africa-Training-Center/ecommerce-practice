import { Response } from 'express';
import { Database } from '../database';
import { ResponseService } from '../utils/response';
import { InterfaceAddProductSub } from '../types/productSubInterface';

export const ProductSubCategory = {
  // View all product sub-categories
  viewAll: async (res: Response): Promise<void> => {
    try {
      const subCategories = await Database.ProductSubCategory.findAll({
        include: [
          {
            model: Database.ProductCategory,
            as: 'category',
            attributes: ['id', 'name', 'description'],
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
      if (!subCategories || subCategories.length === 0) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Product subCategories not found',
          res,
        });
        return;
      }
      ResponseService({
        data: subCategories,
        success: true,
        status: 200,
        message: 'All Product subCategories successfully fetched',
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

  // Create a product sub-category
  create: async (data: InterfaceAddProductSub, res: Response): Promise<void> => {
    try {
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

  // View a single sub-category
  viewSingle: async (dataName: string, res: Response): Promise<void> => {
    try {
      const subCategory = await Database.ProductSubCategory.findOne({
        where: { name: dataName },
        include: [
          {
            model: Database.ProductCategory,
            as: 'category',
            attributes: ['id', 'name', 'description'],
            required: false,
          },
          {
            model: Database.Product,
            as: 'products',
            attributes: ['id', 'name', 'price'],
            required: false,
          },
        ],
        raw: true,
      });
      if (!subCategory) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Product sub-category not found',
          res,
        });
        return;
      }
      ResponseService({
        data: subCategory,
        success: true,
        status: 200,
        message: 'Product sub-category successfully fetched',
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

  // Delete a product sub-category
  delete: async (dataId: string, res: Response): Promise<void> => {
    try {
      const categoryExists = await Database.ProductSubCategory.findOne({
        where: { id: dataId },
      });
      if (!categoryExists) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Product sub-category not found',
          res,
        });
        return;
      }
      const subcategory = await Database.ProductSubCategory.destroy({
        where: { id: dataId },
      });
      ResponseService({
        data: subcategory,
        success: true,
        status: 200,
        message: 'Product sub-category successfully deleted',
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

  // Edit a product sub-category
  update: async (data: InterfaceAddProductSub, dataId: string, res: Response): Promise<void> => {
    try {
      const categoryExists = await Database.ProductSubCategory.findOne({
        where: { id: dataId },
      });
      if (!categoryExists) {
        ResponseService({
          data: null,
          success: false,
          status: 404,
          message: 'Product sub-category not found',
          res,
        });
        return;
      }
      const { name, productCatId } = data;
      const updateSubCategory = await Database.ProductSubCategory.update(
        {
          name,
          productCatId,
          updatedAt: new Date(),
        },
        {
          where: {
            id: dataId,
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
