import { IRequestUser } from '../middlewares/authMiddleware';

export interface productInterface {
  productId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  productCatId: string;
  productSubCatId: string;
  variation: object | null;
  isAvailable: boolean;
  expiredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface interfaceAddProduct extends Omit<productInterface, 'productId'> {
  image: string[];
}

export interface ProductIdRequest extends IRequestUser {
  params: {
    id: string;
  };
}

export interface ProductRequest extends IRequestUser {
  body: interfaceAddProduct;
}
