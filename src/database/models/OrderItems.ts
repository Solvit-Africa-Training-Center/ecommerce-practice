
import {Sequelize, Model, DataTypes } from "sequelize";
export interface OrderItemAttributes {
    id?: string;
    orderId: string;
    productId: string;
    quantity: number;
    pricePerUnit: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export interface OrderItemCreationAttributes
  extends Omit<OrderItemAttributes, "id" | "createdAt" | "updatedAt" | "deletedAt"> {
  id?: string;
}
export class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes
{
  public id!: string;
  public orderId!: string;
  public productId!: string;
  public quantity!: number;
  public pricePerUnit!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public toJSON(): object | OrderItemAttributes {
    return {
      id: this.id,
      orderId: this.orderId,
      productId: this.productId,
      quantity: this.quantity,
      pricePerUnit: this.pricePerUnit,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  static associate(models: any) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order",
    });
    OrderItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  }
}
export const OrderItemModel = (sequelize: Sequelize) => {
  OrderItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pricePerUnit: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "OrderItems",
      timestamps: true,
      paranoid: true, // Enables soft deletes
    }
  );
  return OrderItem;
};