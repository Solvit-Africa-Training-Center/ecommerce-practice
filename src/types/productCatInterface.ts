export interface productCatInterface {
  productCatId: string;
  name: string;
  description: string;
}

export interface interfaceAddProductCat
  extends Omit<productCatInterface, "productCatId"> {}
