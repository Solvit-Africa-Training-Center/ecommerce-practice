import { Request } from 'express';

export interface ProductCatInterface {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InterfaceAddProductCat = Omit<ProductCatInterface, 'id' | 'createdAt' | 'updatedAt'>;

export interface ProductCategoryRequest extends Request {
  body: ProductCatInterface;
}

export interface ProductCategoryIdRequest extends Request {
  params: {
    id: string;
  };
}
