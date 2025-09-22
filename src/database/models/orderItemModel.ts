import { Sequelize, Model, DataTypes } from 'sequelize';
import { Product } from './Products';
import { Order } from './orderModel';

export interface OrderItemAttributes {
  id?: string;
  orderId: string;
  productId: string;
  quantity: number;
  pricePerUnit: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type OrderItemCreationAttributes= Omit<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>; 

// Define class
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
  public deletedAt?: Date | null;

  // Clean JSON serializer
  public toJSON(): OrderItemAttributes {
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

  // Association typing
  static associate(models: { Order: typeof Order; Product: typeof Product }): void {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'orderId',
      targetKey: 'id',
      as: 'order',
    });
    OrderItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      targetKey: 'id',
      as: 'product',
    });
  }
}

// Init model
export const OrderItemModel = (sequelize: Sequelize): typeof OrderItem => {
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
      modelName: 'OrderItem',
      tableName: 'orderitems',
      timestamps: true,
      paranoid: true, 
    },
  );

  return OrderItem;
};
