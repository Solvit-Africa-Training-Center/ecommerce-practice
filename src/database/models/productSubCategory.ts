import { Model, DataTypes, Sequelize } from 'sequelize';
import { ProductCategory } from './productCategory';
import { Product } from './Products';

interface ProductSubCatAttributes {
  productSubCatId: string;
  name: string;
  productCatId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddProductSubCat extends Omit<ProductSubCatAttributes, 'productSubCatId'> {
  productSubCatId?: string;
}

export class ProductSubCategory
  extends Model<ProductSubCatAttributes, AddProductSubCat>
  implements ProductSubCatAttributes
{
  public productSubCatId!: string;
  public name!: string;
  public productCatId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: {
    ProductCategory: typeof ProductCategory;
    Product: typeof Product;
  }): void {
    ProductSubCategory.belongsTo(models.ProductCategory, {
      foreignKey: 'productCatId',
      as: 'category',
    });
    ProductSubCategory.hasMany(models.Product, {
      foreignKey: 'productSubCatId',
      as: 'products',
    });
  }

  public toJSON(): object {
    return {
      productSubCatId: this.productSubCatId,
      name: this.name,
      productCatId: this.productCatId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const ProductSubCategoryModel = (sequelize: Sequelize): typeof ProductSubCategory => {
  ProductSubCategory.init(
    {
      productSubCatId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      productCatId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'product_sub_categories',
      timestamps: true,
    },
  );

  return ProductSubCategory;
};
