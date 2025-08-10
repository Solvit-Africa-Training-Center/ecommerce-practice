import { Sequelize,Model,DataTypes } from "sequelize";
export interface OrderAttributes {
    id?: string;
    userId: string;
    orderStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed'| 'refunded';
    totalAmount: number;
    shippingAddress: string;
    trackingNumber?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}


export interface OrderCreationAttributes
  extends Omit<OrderAttributes, "id" | "createdAt" | "updatedAt" | "deletedAt"> {
  id?: string;
}

export class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: string;
  public userId!: string;
  public orderStatus!: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  public paymentStatus!: 'pending' | 'paid' | 'failed' | 'refunded';
  public totalAmount!: number;
  public shippingAddress!: string;
  public trackingNumber?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public toJSON(): object | OrderAttributes {
    return {
      id: this.id,
      userId: this.userId,
      orderStatus: this.orderStatus,
      paymentStatus: this.paymentStatus,
      totalAmount: this.totalAmount,
      shippingAddress: this.shippingAddress,
      trackingNumber: this.trackingNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  static associate(models: any) {
    Order.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: "orderId",
      as: "items",
    });
  }
}
export const OrderModel = (sequelize: Sequelize) => {
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      orderStatus: {
        type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      shippingAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      trackingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
        updatedAt: {
            type: DataTypes.DATE,
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
        tableName: "orders",
        modelName: "Order",
        timestamps: true,
        paranoid: true, // Enables soft deletes
        }
  );

  return Order;
};