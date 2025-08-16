import { Router } from 'express';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import { authMiddleware, checkRole, rateLimiting } from '../middlewares/authMiddleware';
import { RatingController } from '../controllers/ratingAndReviewController';
import { AddRatingReviewSchema, IdValidationSchema } from '../schema/ratingAndReviewSchema';

const ratingRoutes = Router();
const controller = new RatingController();

// Rating routes
ratingRoutes.post(
  '/rate/:productId',
  rateLimiting(10),
  authMiddleware,
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  ValidationMiddleware({ type: 'body', schema: AddRatingReviewSchema }),
  controller.rateProduct.bind(controller),
);

ratingRoutes.get(
  '/:productId/ratings',
  rateLimiting(100),
  authMiddleware,
  checkRole(['admin']),
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.getAllProductRatings.bind(controller),
);

ratingRoutes.get(
  '/:productId/ratings/stats',
  rateLimiting(50),
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.getProductRatingStats.bind(controller),
);

ratingRoutes.get(
  '/:productId/my-rating',
  rateLimiting(30),
  authMiddleware,
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.getUserRatingForProduct.bind(controller),
);

ratingRoutes.get(
  '/user/my-ratings',
  rateLimiting(20),
  authMiddleware,
  controller.getUserRatings.bind(controller),
);

export { ratingRoutes };
