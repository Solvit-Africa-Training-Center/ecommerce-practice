import { DataTypes, Sequelize, Model } from "sequelize";
import { Product } from "./Products";
import { User } from "./Users";

export interface RatingAttributes {
  ratingId: string;
  star: number;
  review: string;
  postedBy: string; // userId
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RatingCreationAttributes
  extends Omit<RatingAttributes, "ratingId" | "createdAt" | "updatedAt"> {
  ratingId?: string;
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
  public ratingId!: string;
  public star!: number;
  public review!: string;
  public postedBy!: string;
  public productId!: string;
  public updatedAt!: Date;
  public createdAt!: Date;

  public toJSON(): object | RatingAttributes {
    return {
      ratingId: this.ratingId,
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
      as: 'user'
    });

    // Rating belongs to Product
    Rating.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
  }
}

export const RatingModel = (sequelize: Sequelize) => {
  Rating.init(
    {
      ratingId: {
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
        allowNull: true
      },
      postedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        }
      },
    },
    {
      sequelize,
      modelName: "Rating",
      tableName: "ratings",
      timestamps: true,
      hooks: {
        async afterCreate(rating) {
          await updateProductRating(rating.productId);
        },
        async afterUpdate(rating) {
          await updateProductRating(rating.productId);
        },
      },
    }
  );

  return Rating;
};

// Helper function to update product's average rating
async function updateProductRating(productId: string) {
  const ratings = await Rating.findAll({
    where: { productId },
    attributes: ["star"],
    raw: true,
  });

  if (!ratings.length) return;

  const avg =
    ratings.reduce((sum, r) => sum + r.star, 0) / ratings.length;

  await Product.update(
    { rating: parseFloat(avg.toFixed(2)) },
    { where: { productId } }
  );
}