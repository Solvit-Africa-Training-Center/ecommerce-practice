import { Request, Response } from 'express';
import { Product } from '../services/productService';
import { ProductCategory } from '../services/productCategoryService';
import { ProductSubCategory } from '../services/productSubCategoryService';
import { ProductIdRequest, ProductRequest } from '../types/productInterface';
import { ProductCategoryIdRequest, ProductCategoryRequest } from '../types/productCatInterface';
import { ProductSubCategoryIdRequest, ProductSubCategoryRequest } from '../types/productSubInterface';
import { ResponseService } from '../utils/response';

export class ProductController {
  // Product catgories
  public async viewAllCategories(req: Request, res: Response) {
    try {
      ProductCategory.viewAll(res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async createCategory(req: ProductCategoryRequest, res: Response) {
    try {
      ProductCategory.create(req.body, res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async viewSingleCategory(req: Request, res: Response) {
    try {
      const { name } = req.params;
      ProductCategory.viewSingle(name, res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async deleteCategory(req: ProductCategoryIdRequest, res: Response) {
    try {
      const { id } = req.params;
      ProductCategory.delete(id, res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async updateCategory(req: ProductCategoryRequest, res: Response) {
    try {
      const { id } = req.params;
      ProductCategory.update(req.body, id,res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  
  // sub-category
  public async viewAllSubCategories(req: Request, res: Response) {
    try {
      ProductSubCategory.viewAll(res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async createSubCategory(req: ProductSubCategoryRequest, res: Response) {
    try {
      ProductSubCategory.create(req.body, res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async viewSingleSubCategory(req: Request, res: Response) {
    try {
      const { name } = req.params;
      ProductSubCategory.viewSingle(name, res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async deleteSubCategory(req: ProductSubCategoryIdRequest, res: Response) {
    try {
      const { id } = req.params;
      ProductSubCategory.delete(id, res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async updateSubCategory(req: ProductSubCategoryRequest, res: Response) {
    try {
      const { id } = req.params;
      ProductSubCategory.update(req.body, id, res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  
  // Products
  public async viewAllProducts(req: Request, res: Response) {
    try {
      Product.viewAll(res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async createProduct(req: ProductRequest, res: Response) {
    try {
      const user = req?.user?.id as string;
      Product.create(req.body, user, res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async viewSingleProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      Product.viewSingle(id, res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async deleteProduct(req: ProductIdRequest, res: Response) {
    try {
      const { id } = req.params;
      Product.delete(id, res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }

  public async updateProduct(req: ProductRequest, res: Response) {
    try {
      const userId = req?.user?.id as string;
      const { id } = req.params;
      Product.update(req.body, id, userId, res);
    } catch (err) {
      const { message, stack } = err as Error
      ResponseService({
        data: {message, stack},
        success: false,
        status: 500,
        res,
      });
    }
  }
}
