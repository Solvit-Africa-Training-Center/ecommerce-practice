import { Model, DataTypes, Sequelize } from 'sequelize';
import { ProductCategory } from './productCategory';
import { Product } from './Products';

interface ProductSubCatAttributes {
  id: string;
  name: string;
  productCatId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddProductSubCat extends Omit<ProductSubCatAttributes, 'id'> {
  id?: string;
}

export class ProductSubCategory
  extends Model<ProductSubCatAttributes, AddProductSubCat>
  implements ProductSubCatAttributes
{
  public id!: string;
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
      id: this.id,
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
      id: {
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
        references: {
          model: 'product_categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
