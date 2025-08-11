import { Sequelize } from "sequelize";
import { UserModal, User } from "./Users";
import { RoleModel, Role } from "./Roles";
import { Product, ProductModel } from "./Products";
import { ProductCategory, ProductCategoryModel } from "./productCategory";
import { ProductSubCategory, ProductSubCategoryModel } from "./productSubCategory";
import { Rating, RatingModel } from "./ratings";
interface Modals {
  User: typeof User;
  Role: typeof Role;
  Product: typeof Product;
  ProductCategory: typeof ProductCategory;
  ProductSubCategory: typeof ProductSubCategory;
  Rating: typeof Rating;
}
export const AllModal = (sequelize: Sequelize): Modals => {
  return {
    User: UserModal(sequelize),
    Role: RoleModel(sequelize),
    Product: ProductModel(sequelize),
    ProductCategory: ProductCategoryModel(sequelize),
    ProductSubCategory: ProductSubCategoryModel(sequelize),
    Rating: RatingModel(sequelize)
  }
};
