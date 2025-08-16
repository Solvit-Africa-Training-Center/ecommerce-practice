import { Request } from 'express';

export interface ProductSubInterface {
  id: string;
  name: string;
  description: string;
  productCatId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InterfaceAddProductSub = Omit<ProductSubInterface, 'id' | 'createdAt' | 'updatedAt'>;

export interface ProductSubCategoryRequest extends Request {
  body: ProductSubInterface;
}

export interface ProductSubCategoryIdRequest extends Request {
  params: {
    id: string;
  };
}
