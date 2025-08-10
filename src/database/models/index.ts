import { Sequelize } from "sequelize";
import { UserModal, User } from "./Users";
import { RoleModel, Role } from "./Roles";
import { Product, ProductModel } from "./products";
import { ProductCategory, ProductCategoryModel } from "./productCat";
import { ProductSubCategory, ProductSubCategoryModel } from "./productSubCategory";
import { Order, OrderModel } from "./Orders";
import { OrderItem, OrderItemModel } from "./OrderItems";

interface Modals {
  Order: typeof Order;
  OrderItem: typeof OrderItem;
  User: typeof User;
  Role: typeof Role;
  Product: typeof Product;
  ProductCategory: typeof ProductCategory;
  ProductSubCategory?: typeof ProductSubCategory;
}
export const AllModal = (sequelize: Sequelize): Modals => {
  return {
    User: UserModal(sequelize),
    Role: RoleModel(sequelize),
    Order: OrderModel(sequelize),
    OrderItem: OrderItemModel(sequelize),
    Product: ProductModel(sequelize),
    ProductCategory: ProductCategoryModel(sequelize),
    ProductSubCategory: ProductSubCategoryModel(sequelize)

  };
};
