import { DataTypes, Model, Sequelize } from "sequelize";

interface ProductCatAttributes {
  productCatId: string;
  name: string;
  description: string;
}

export interface ProductCatCreationAttributes
  extends Omit<ProductCatAttributes, "productCatId"> {
  productCatId?: string;
}

export class ProductCategory
  extends Model<ProductCatAttributes, ProductCatCreationAttributes>
  implements ProductCatAttributes
{
  public productCatId!: string;
  public name!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    ProductCategory.hasMany(models.Product, {
      foreignKey: "productCatId",
      as: "products",
    });
    ProductCategory.hasMany(models.ProductSubCategory, {
      foreignKey: "productCatId",
      as: "subCategories",
    });
  }

  public toJSON(): object {
    return {
      productCatId: this.productCatId,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const ProductCategoryModel = (sequelize: Sequelize) => {
  ProductCategory.init(
    {
      productCatId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProductCategory",
      tableName: "product_categories",
      timestamps: true,
    },
  );

  return ProductCategory;
};
