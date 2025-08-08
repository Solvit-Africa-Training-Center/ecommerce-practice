export interface productInterface {
  productId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  productCatId: string;
  rating: number;
}

export interface interfaceAddProduct
  extends Omit<productInterface, "productId"> {}
