import { Sequelize, Model, DataTypes } from "sequelize";

interface PaymentAttribute {
  paymentId: string;
  orderId: string;
  txRef: string;
  amount: number;
  flwTransactionId: string| null; 
  status: "pending" | "successful" | "failed" | "cancelled";
  method: 'card' | 'mobilemoney' | 'airtelmoney'|'banktransfer';
  customerId: string;
  currency?: string; 
  rawEvent: string| null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface PaymentCreationAttribute extends Omit<
  PaymentAttribute,
  "paymentId" | "createdAt" | "updatedAt" | "flwTransactionId" | "customerId" | "rawEvent"
> {
  paymentId?: string;
  flwTransactionId?: string;
  customerId?: string;
  rawEvent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Payment extends Model<PaymentAttribute, PaymentCreationAttribute> implements PaymentAttribute {
  paymentId!: string;
  orderId!: string;
  txRef!: string;
  amount!: number;
  flwTransactionId!: string;
  status!: "pending" | "successful" | "failed" | "cancelled";
  method!: 'card' | 'mobilemoney' | 'airtelmoney'| 'banktransfer';
  customerId!: string;
  rawEvent!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt: Date | null = null;

  public static associate(models: any) {
    Payment.belongsTo(models.Order, {
      foreignKey: 'orderId',
      targetKey:'id',
      as: 'order'  
    });
    Payment.belongsTo(models.User, {
      foreignKey: 'customerId', 
      targetKey: 'id',
      as: 'customer'
    });
  }

  public toJSON(): object | PaymentAttribute {
    return {
      paymentId: this.paymentId,
      orderId: this.orderId,
      txRef: this.txRef,
      amount: this.amount,
      flwTransactionId: this.flwTransactionId,
      status: this.status,
      method: this.method,
      customerId: this.customerId,
      rawEvent: this.rawEvent,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}

export const PaymentModel = (sequelize: Sequelize) => {
  Payment.init(
    {
      paymentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      txRef: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      flwTransactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "successful", "failed", "cancelled"),
        allowNull: false,
      },
      method: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['card', 'mobilemoney','airtelmoney', 'banktransfer']]
        }
      },
      customerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      rawEvent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Payment",
      tableName: "payments",
      paranoid: true, 
    },
  );
  return Payment;
};
