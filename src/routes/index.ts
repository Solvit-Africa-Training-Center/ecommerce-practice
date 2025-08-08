import { Router } from 'express';
import { userRouter } from './userRoutes';
import { swaggerRouter } from './swaggerRoutes';
import { productRoutes } from './productRoutes';

const routers = Router();
const allRoutes = [userRouter, productRoutes, swaggerRouter];
routers.use('/api', ...allRoutes);

export { routers };
