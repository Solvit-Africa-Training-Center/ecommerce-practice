import { DataTypes, Sequelize, Model } from "sequelize";

interface ProductAttributes {
  productId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  productCatId: string;
  rating: number;
  variation: object | null;
  image: string[];
}

export interface ProductCreationAttributes
  extends Omit<ProductAttributes, "productId"> {
  productId?: string;
}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  static getProductById(productId: any) {
    throw new Error("Method not implemented.");
  }
  public productId!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public productCatId!: string;
  public rating!: number;
  public variation!: object | null;
  public image!: string[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Product.belongsTo(models.ProductCategory, {
      foreignKey: "productCatId",
      as: "category",
    });
    Product.belongsTo(models.ProductSubCategory, {
      foreignKey: "productSubId",
      as: "subCategory",
    });
  }

  public toJSON(): object {
    return {
      productId: this.productId,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      productCatId: this.productCatId,
      rating: this.rating,
      variation: this.variation,
      image: this.image,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const ProductModel = (sequelize: Sequelize) => {
  Product.init(
    {
      productId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      variation: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      image: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      timestamps: true,
    },
  );

  return Product;
};
