import { Router } from 'express';
import { userRouter } from './userRoutes';
import { swaggerRouter } from './swaggerRoutes';
import { profileRouter } from './profileRoutes';
import { productRoutes } from './productRoutes';
import { ratingRoutes } from './ratingAndReviewRoutes';
import { cartRoutes } from './cartRoutes';

const routers = Router();
const allRoutes = [
  userRouter,
  productRoutes,
  swaggerRouter,
  profileRouter,
  ratingRoutes,
  cartRoutes,
];

routers.use('/api', ...allRoutes);

export { routers };
