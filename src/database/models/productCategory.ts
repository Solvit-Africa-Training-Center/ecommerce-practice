import { DataTypes, Model, Sequelize } from 'sequelize';
import { Product } from './Products';
import { ProductSubCategory } from './productSubCategory';

interface ProductCatAttributes {
  id: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCatCreationAttributes extends Omit<ProductCatAttributes, 'id'> {
  id?: string;
}

export class ProductCategory
  extends Model<ProductCatAttributes, ProductCatCreationAttributes>
  implements ProductCatAttributes
{
  public id!: string;
  public name!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: {
    Product: typeof Product;
    ProductSubCategory: typeof ProductSubCategory;
  }): void {
    ProductCategory.hasMany(models.Product, {
      foreignKey: 'productCatId',
      as: 'products',
    });
    ProductCategory.hasMany(models.ProductSubCategory, {
      foreignKey: 'productCatId',
      as: 'subCategories',
    });
  }

  public toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const ProductCategoryModel = (sequelize: Sequelize): typeof ProductCategory => {
  ProductCategory.init(
    {
      id: {
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
    },
    {
      sequelize,
      modelName: 'ProductCategory',
      tableName: 'product_categories', // Make sure this matches your actual table name
      timestamps: true,
    },
  );

  return ProductCategory;
};
