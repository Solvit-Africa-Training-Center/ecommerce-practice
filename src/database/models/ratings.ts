import { DataTypes, Sequelize, Model } from 'sequelize';
import { User } from './Users';
import { Product } from './Products';

export interface RatingAttributes {
  id: string;
  star: number;
  review: string;
  postedBy: string; // userId
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RatingCreationAttributes
  extends Omit<RatingAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
}

export class Rating
  extends Model<RatingAttributes, RatingCreationAttributes>
  implements RatingAttributes
{
  public id!: string;
  public star!: number;
  public review!: string;
  public postedBy!: string;
  public productId!: string;
  public updatedAt!: Date;
  public createdAt!: Date;

  public toJSON(): object | RatingAttributes {
    return {
      id: this.id,
      star: this.star,
      review: this.review,
      postedBy: this.postedBy,
      productId: this.productId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static associate(models: { User: typeof User; Product: typeof Product }): void {
    // Rating belongs to User
    Rating.belongsTo(models.User, {
      foreignKey: 'postedBy',
      as: 'user',
    });

    // Rating belongs to Product
    Rating.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
}

export const RatingModel = (sequelize: Sequelize) => {
  Rating.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      star: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      review: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Rating',
      tableName: 'ratings',
      timestamps: true,
    },
  );

  return Rating;
};
