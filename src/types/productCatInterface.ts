import { IRequestUser } from '../middlewares/authMiddleware';

export interface ProductCatInterface {
  productCatId: string;
  name: string;
  description: string;
}

export interface InterfaceAddProductCat extends Omit<ProductCatInterface, 'productCatId'> {};

export interface ProductCategoryRequest extends IRequestUser{
  body: ProductCatInterface;
};

export interface ProductCategoryIdRequest extends IRequestUser {
  params: {
    id: string;
  };
}
