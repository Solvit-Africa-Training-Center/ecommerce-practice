import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './Users';
import { Product } from './Products';

interface RatingAttributes {
  ratingId: string;
  userId: string;
  productId: string;
  ratings: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RatingCreationAttributes extends Omit<RatingAttributes, 'ratingId'> {
  ratingId?: string;
}

export class Rating
  extends Model<RatingAttributes, RatingCreationAttributes>
  implements RatingAttributes
{
  public ratingId!: string;
  public userId!: string;
  public productId!: string;
  public ratings!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: { User: typeof User; Product: typeof Product }): void {
    Rating.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Rating.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }

  public toJSON(): object {
    return {
      ratingId: this.ratingId,
      userId: this.userId,
      productId: this.productId,
      ratings: this.ratings,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const RatingModel = (sequelize: Sequelize): typeof Rating => {
  Rating.init(
    {
      ratingId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      ratings: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: 'Rating',
      tableName: 'ratings',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['productId', 'userId'],
        },
      ],
    },
  );

  return Rating;
};
