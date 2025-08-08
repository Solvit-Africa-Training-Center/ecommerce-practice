import { Request, Response } from 'express';
import { Product } from '../services/productService';
import { ProductCategory } from '../services/productCategoryService';
import { ProductSubCategory } from '../services/productSubCategoryService';
import { ProductIdRequest, ProductRequest } from '../types/productInterface';
import { ProductCategoryIdRequest, ProductCategoryRequest } from '../types/productCatInterface';
import { ProductSubCategoryIdRequest, ProductSubCategoryRequest } from '../types/productSubInterface';


export class ProductController {

  // Product catgories

  public async viewAllCategories(req: Request, res: Response) {
    try {
      ProductCategory.viewAll(res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  public async createCategory(req: ProductCategoryRequest, res: Response) {
    try {
      const user = req?.user?.id as string;
      ProductCategory.create(req.body, user, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  public async viewSingleCategory(req: Request, res: Response) {
    try {
      const { name } = req.params;
      ProductCategory.viewSingle(name, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  public async deleteCategory(req: ProductCategoryIdRequest, res: Response) {
    try {
      const userId = req?.user?.id as string;
      const { id } = req.params;
      ProductCategory.delete(id, userId, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  public async updateCategory(req: ProductCategoryRequest, res: Response) {
    try {
      const userId = req?.user?.id as string;
      const { id } = req.params;
      ProductCategory.update(req.body, id, userId, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  // sub-category

  public async viewAllSubCategories(req: Request, res: Response) {
    try {
      ProductSubCategory.viewAll(res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  public async createSubCategory(req: ProductSubCategoryRequest, res: Response) {
    try {
      const user = req?.user?.id as string;
      ProductSubCategory.create(req.body, user, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  public async viewSingleSubCategory(req: Request, res: Response) {
    try {
      const { name } = req.params;
      ProductSubCategory.viewSingle(name, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  public async deleteSubCategory(req: ProductSubCategoryIdRequest, res: Response) {
    try {
      const userId = req?.user?.id as string;
      const { id } = req.params;
      ProductSubCategory.delete(id, userId, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  public async updateSubCategory(req: ProductSubCategoryRequest, res: Response) {
    try {
      const userId = req?.user?.id as string;
      const { id } = req.params;
      ProductSubCategory.update(req.body, id, userId, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }


  // Products

  public async viewAllProducts(req: Request, res: Response) {
    try {
      Product.viewAll(res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  public async createProduct(req: ProductRequest, res: Response) {
    try {
      const user = req?.user?.id as string;
      Product.create(req.body, user, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  public async viewSingleProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      Product.viewSingle(id, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  public async deleteProduct(req: ProductIdRequest, res: Response) {
    try {
      const userId = req?.user?.id as string;
      const { id } = req.params;
      Product.delete(id, userId, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  public async updateProduct(req: ProductRequest, res: Response) {
    try {
      const userId = req?.user?.id as string;
      const { id } = req.params;
      Product.update(req.body, id, userId, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }
}
