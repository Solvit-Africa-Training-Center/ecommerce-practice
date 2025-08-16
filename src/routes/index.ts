import { Router } from 'express';
import { userRouter } from './userRoutes';
import { swaggerRouter } from './swaggerRoutes';
import { profileRouter } from './profileRoutes';
import { productRoutes } from './productRoutes';
import { cartRoutes } from './cartRoutes';
    

const routers = Router();
const allRoutes = [userRouter, productRoutes, swaggerRouter, profileRouter, cartRoutes];

routers.use('/api', ...allRoutes);

export { routers };
