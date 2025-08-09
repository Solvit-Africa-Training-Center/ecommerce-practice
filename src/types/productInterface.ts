export interface productInterface {
  productId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  rating: number;
  variation: object | null;
}

export interface interfaceAddProduct
  extends Omit<productInterface, "productId"> {}
