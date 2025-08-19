import { Sequelize } from 'sequelize';
import { UserModal, User } from './Users';
import { RoleModel, Role } from './Roles';
import { ProfileModel, Profile } from './Profiles';
import { Product, ProductModel } from './Products';
import { ProductCategory, ProductCategoryModel } from './productCategory';
import { ProductSubCategory, ProductSubCategoryModel } from './productSubCategory';
import { Rating, RatingModel } from './ratings';
import { Cart, CartModel } from './cartModel';
import { CartItem, CartItemModel } from './cartItemModel';
interface Modals {
  User: typeof User;
  Role: typeof Role;
  Profile: typeof Profile;
  Product: typeof Product;
  ProductCategory: typeof ProductCategory;
  ProductSubCategory: typeof ProductSubCategory;
  Rating: typeof Rating;
  Cart: typeof Cart;
  CartItem: typeof CartItem;
}
export const AllModal = (sequelize: Sequelize): Modals => ({
  User: UserModal(sequelize),
  Role: RoleModel(sequelize),
  Profile: ProfileModel(sequelize),
  Product: ProductModel(sequelize),
  ProductCategory: ProductCategoryModel(sequelize),
  ProductSubCategory: ProductSubCategoryModel(sequelize),
  Rating: RatingModel(sequelize),
  Cart: CartModel(sequelize),
  CartItem: CartItemModel(sequelize),
});
