import { Request, Response } from 'express';
import { IRequestUser } from '../middlewares/authMiddleware';
import { RatingService } from '../services/ratingAndReviewService';

export class RatingController {

  /**
   * Rate a product or update existing rating
   */
  public async rateProduct(req: IRequestUser, res: Response) {
    try {
      const userId = req?.user?.id as string;
      const { productId } = req.params;
      const { star, review } = req.body;
      RatingService.createOrUpdate({ productId, star, review }, userId, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  /**
   * Get all ratings for a specific product with user details
   */
  public async getAllProductRatings(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      
      RatingService.getAllByProduct(productId, pageNum, limitNum, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  /**
   * Get rating statistics for a product
   */
  public async getProductRatingStats(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      RatingService.getStatsByProduct(productId, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  /**
   * Get current user's rating for a product
   */
  public async getUserRatingForProduct(req: IRequestUser, res: Response) {
    try {
      const userId = req?.user?.id as string;
      const { productId } = req.params;
      
      RatingService.getUserRatingForProduct(productId, userId, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }

  /**
   * Get all ratings by the current user
   */
  public async getUserRatings(req: IRequestUser, res: Response) {
    try {
      const userId = req?.user?.id as string;
      const { page = 1, limit = 10 } = req.query;
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      
      RatingService.getAllByUser(userId, pageNum, limitNum, res);
    } catch (error) {
      console.error('Controller error:', error);
    }
  }
}