import { Request } from 'express';

export interface ProductCatInterface {
  productCatId: string;
  name: string;
  description: string;
}

export interface InterfaceAddProductCat extends Omit<ProductCatInterface, 'productCatId'> {};

export interface ProductCategoryRequest extends Request{
  body: ProductCatInterface;
};

export interface ProductCategoryIdRequest extends Request {
  params: {
    id: string;
  };
}
