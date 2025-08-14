import { Router } from 'express';
import { userRouter } from './userRoutes';
import { swaggerRouter } from './swaggerRoutes';
import { profileRouter } from './profileRoutes';
import { productRoutes } from './productRoutes';
import { ratingRoutes } from './ratingAndReviewRoutes';

const routers = Router();
const allRoutes = [userRouter, productRoutes, swaggerRouter, profileRouter, ratingRoutes];

routers.use('/api', ...allRoutes);

export { routers };
