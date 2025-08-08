import { IRequestUser } from '../middlewares/authMiddleware';

export interface productInterface {
  productId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  rating: number;
  variation: object | null;
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
