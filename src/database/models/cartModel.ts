import { DataTypes, Model, Optional, Sequelize, HasManyGetAssociationsMixin } from 'sequelize';
import { CartItem } from './cartItemModel';
import { User } from './Users';

export interface CartAttributes {
  id: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  items?: CartItem[];
}

export type CartCreationAttributes = Optional<CartAttributes, 'id'>;

export class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public id!: string;
  public userId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public items?: CartItem[];

  public getItems!: HasManyGetAssociationsMixin<CartItem>;

  public static associate(models: { CartItem: typeof CartItem; User: typeof User }): void {
    Cart.hasMany(models.CartItem, {
      foreignKey: 'cartId',
      sourceKey: 'id',
      as: 'items',
      onDelete: 'CASCADE',
    });

    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'user',
    });
  }

  public toJSON(): CartAttributes {
    return {
      id: this.id,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      items: this.items, // Ensure items are included in JSON
    };
  }
}

export const CartModel = (sequelize: Sequelize): typeof Cart => {
  Cart.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'carts',
      timestamps: true,
      modelName: 'Cart',
    },
  );
  return Cart;
};
