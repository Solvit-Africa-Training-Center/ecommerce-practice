import { Router } from 'express';
import { userRouter } from './userRoutes';
import { swaggerRouter } from './swaggerRoutes';

const routers = Router();
const allRoutes = [userRouter, swaggerRouter];
routers.use('/api', ...allRoutes);
export { routers };
