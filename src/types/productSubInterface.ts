import { Request } from "express";

export interface ProductSubInterface {
  productSubId: string;
  name: string;
  description: string;
  productCatId: string;
}

export interface InterfaceAddProductSub extends Omit<ProductSubInterface, 'productSubId'> {}

export interface ProductSubCategoryRequest extends Request{
  body:ProductSubInterface;
}

export interface ProductSubCategoryIdRequest extends Request {
  params: {
    id: string;
  };
}
