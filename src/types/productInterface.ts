import { IRequestUser } from '../middlewares/authMiddleware';

export interface ProductInterface {
  id: string;
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

export interface CreateProductInterface
  extends Omit<ProductInterface, 'id' | 'createdAt' | 'updatedAt'> {
  images?: string[];
}

export interface UpdateProductInterface
  extends Partial<Omit<ProductInterface, 'id' | 'createdAt' | 'updatedAt'>> {
  images?: string[];
}

export interface ProductIdRequest extends IRequestUser {
  params: {
    id: string;
  };
}

export interface ProductRequest extends IRequestUser {
  body: CreateProductInterface;
}
