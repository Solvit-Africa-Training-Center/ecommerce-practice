import { DataTypes, Sequelize, Model } from 'sequelize';
import { ProductCategory } from './productCategory';
import { ProductSubCategory } from './productSubCategory';
import { User } from './Users';
import { Rating } from './ratings';

export interface ProductAttributes {
  productId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  productCatId: string;
  productSubCatId: string;
  userId: string;
  variation: object | null;
  images: string[];
  isAvailable: boolean;
  rating: number;
  review: string;
  expiredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes extends Omit<ProductAttributes, 'productId' | 'rating' | 'review'> {
  productId?: string;
}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public productId!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public productCatId!: string;
  public productSubCatId!: string;
  public userId!: string;
  public variation!: object | null;
  public images!: string[];
  public isAvailable!: boolean;
  public rating!: number;
  public review!: string;
  public expiredAt?: Date | undefined;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: {
    User: typeof User;
    ProductCategory: typeof ProductCategory;
    ProductSubCategory: typeof ProductSubCategory;
    Rating: typeof Rating;
  }): void {
    Product.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Product.belongsTo(models.ProductCategory, {
      foreignKey: 'productCatId',
      as: 'category',
    });
    Product.belongsTo(models.ProductSubCategory, {
      foreignKey: 'productSubCatId',
      as: 'subCategory',
    });
    Product.hasMany(models.Rating, {
      foreignKey: 'productId',
      as: 'ratings',
    });
  }

  public toJSON(): object | ProductAttributes {
    return {
      productId: this.productId,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      productCatId: this.productCatId,
      productSubCatId: this.productSubCatId,
      userId: this.userId,
      variation: this.variation,
      images: this.images,
      isAvailable: this.isAvailable,
      rating: this.rating,
      review: this.review,
      expiredAt: this.expiredAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const ProductModel = (sequelize: Sequelize): typeof Product => {
  Product.init(
    {
      productId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      productCatId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productSubCatId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      variation: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      review: {
        type: DataTypes.STRING,
        allowNull: true
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      timestamps: true,
    },
  );

  return Product;
};
