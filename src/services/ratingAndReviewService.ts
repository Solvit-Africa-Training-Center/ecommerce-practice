import { Response } from 'express';
import { Rating, RatingStats } from '../database/models/ratings';
import { User } from '../database/models/Users';
import { Product } from '../database/models/Products';
import { ResponseService } from '../utils/response';
import { Err } from 'joi';

export class RatingService {
  /**
   * Create or update a product rating
   */
  public static async createOrUpdate(
    data: { productId: string; star: number; review: string },
    userId: string,
    res: Response,
  ): Promise<void> {
    try {
      const { productId, star, review } = data;

      // Check if product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Product not found',
          res,
        });
        return;
      }

      // Check for existing rating
      const existingRating = await Rating.findOne({
        where: { productId, postedBy: userId },
      });

      let rating;
      if (existingRating) {
        rating = await existingRating.update({ star, review });
      } else {
        rating = await Rating.create({ productId, star, review, postedBy: userId });
      }

      ResponseService({
        status: 200,
        success: true,
        message: 'Rating submitted successfully',
        data: {
          id: rating.id,
          star: rating.star,
          review: rating.review,
          productId: rating.productId,
          isUpdate: !!existingRating,
        },
        res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        status: 500,
        success: false,
        res,
      });
    }
  }

  /**
   * Get all ratings for a specific product
   */
  public static async getAllByProduct(
    productId: string,
    page: number = 1,
    limit: number = 10,
    res: Response,
  ): Promise<void> {
    try {
      const offset = (page - 1) * limit;

      // Check if product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Product not found',
          res,
        });
        return;
      }

      const { count, rows: ratings } = await Rating.findAndCountAll({
        where: { productId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      if (!ratings.length) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'No ratings found for this product',
          res,
        });
        return;
      }

      ResponseService({
        status: 200,
        success: true,
        message: 'Ratings retrieved successfully',
        data: {
          ratings,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalRatings: count,
            hasNext: page < Math.ceil(count / limit),
            hasPrev: page > 1,
          },
        },
        res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        status: 500,
        success: false,
        res,
      });
    }
  }

  /**
   * Get rating statistics for a product
   */
  public static async getStatsByProduct(productId: string, res: Response): Promise<void> {
    try {
      // Check if product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Product not found',
          res,
        });
        return;
      }

      const ratings = await Rating.findAll({
        where: { productId },
        attributes: ['star'],
        raw: true,
      });

      if (!ratings.length) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'No ratings found for this product',
          res,
        });
        return;
      }

      // Calculate statistics
      const totalRatings = ratings.length;
      const ratingsSum = ratings.reduce((sum, rating) => sum + rating.star, 0);
      const averageRating = parseFloat((ratingsSum / totalRatings).toFixed(2));

      // Count ratings by star level
      const starCounts = ratings.reduce(
        (acc, rating) => {
          acc[rating.star] = (acc[rating.star] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>,
      );

      const stats: RatingStats = {
        averageRating,
        totalRatings,
        fiveStars: starCounts[5] || 0,
        fourStars: starCounts[4] || 0,
        threeStars: starCounts[3] || 0,
        twoStars: starCounts[2] || 0,
        oneStar: starCounts[1] || 0,
      };

      // Calculate percentages
      const statsWithPercentages = {
        ...stats,
        percentages: {
          fiveStars: parseFloat(((stats.fiveStars / totalRatings) * 100).toFixed(1)),
          fourStars: parseFloat(((stats.fourStars / totalRatings) * 100).toFixed(1)),
          threeStars: parseFloat(((stats.threeStars / totalRatings) * 100).toFixed(1)),
          twoStars: parseFloat(((stats.twoStars / totalRatings) * 100).toFixed(1)),
          oneStar: parseFloat(((stats.oneStar / totalRatings) * 100).toFixed(1)),
        },
      };

      ResponseService({
        status: 200,
        success: true,
        message: 'Rating statistics retrieved successfully',
        data: statsWithPercentages,
        res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        status: 500,
        success: false,
        res,
      });
    }
  }

  /**
   * Get user's rating for a specific product
   */
  public static async getUserRatingForProduct(
    productId: string,
    userId: string,
    res: Response,
  ): Promise<void> {
    try {
      // Check if product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Product not found',
          res,
        });
        return;
      }

      const rating = await Rating.findOne({
        where: { productId, postedBy: userId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });

      if (!rating) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'You haven\'t rated this product yet',
          res,
        });
        return;
      }

      ResponseService({
        status: 200,
        success: true,
        message: 'User rating retrieved successfully',
        data: rating,
        res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        status: 500,
        success: false,
        res,
      });
    }
  }

  /**
   * Get all ratings by a specific user
   */
  public static async getAllByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
    res: Response,
  ): Promise<void> {
    try {
      const offset = (page - 1) * limit;

      const { count, rows: ratings } = await Rating.findAndCountAll({
        where: { postedBy: userId },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'images', 'price'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      if (!ratings.length) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'No ratings found for this user',
          res,
        });
        return;
      }

      ResponseService({
        status: 200,
        success: true,
        message: 'User ratings retrieved successfully',
        data: {
          ratings,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalRatings: count,
            hasNext: page < Math.ceil(count / limit),
            hasPrev: page > 1,
          },
        },
        res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        status: 500,
        success: false,
        res,
      });
    }
  }
}
