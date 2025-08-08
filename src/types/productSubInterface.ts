export interface productSubInterface {
  productSubId: string;
  name: string;
  description: string;
  productCatId: string;
}

export interface interfaceAddProductSub
  extends Omit<productSubInterface, "productSubId"> {}
