import { IRequestUser } from "../middlewares/authMiddleware";

export interface ProductSubInterface {
  productSubId: string;
  name: string;
  description: string;
  productCatId: string;
}

export interface InterfaceAddProductSub extends Omit<ProductSubInterface, 'productSubId'> {}

export interface ProductSubCategoryRequest extends IRequestUser{
  body:ProductSubInterface;
}

export interface ProductSubCategoryIdRequest extends IRequestUser {
  params: {
    id: string;
  };
}
