import { Model, DataTypes, Sequelize } from "sequelize";

interface ProductSubCatAttributes {
  productSubCatId: string;
  name: string;
  productCatId: string;
}

export interface AddProductSubCat extends Omit<ProductSubCatAttributes, "productSubCatId"> {
  productSubCatId?: string;
}

export class ProductSubCategory extends Model<ProductSubCatAttributes, AddProductSubCat> implements ProductSubCatAttributes {
  public productSubCatId!: string;
  public name!: string;
  public productCatId!: string;

  public static associate(models: any) {
    ProductSubCategory.belongsTo(models.ProductCategory, {
      foreignKey: "productCatId",
      as: "category",
    });
  }

  public toJSON(): object {
    return {
      productSubCatId: this.productSubCatId,
      name: this.name,
      productCatId: this.productCatId,
    };
  }

}

export const ProductSubCategoryModel = (sequelize: Sequelize) => {
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
      },
      productCatId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "product_sub_categories",
      timestamps: false,
    }
  );

  return ProductSubCategory;
};
