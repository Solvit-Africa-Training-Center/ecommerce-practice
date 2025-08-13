import { Router } from 'express';
import { userRouter } from './userRoutes';
import { swaggerRouter } from './swaggerRoutes';
import { profileRouter } from './profileRoutes';

const routers = Router();
const allRoutes = [userRouter, swaggerRouter, profileRouter];
routers.use('/api', ...allRoutes);
export { routers };
