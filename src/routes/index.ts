import { Router } from 'express';
import { userRouter } from './userRoutes';

const routers = Router();
const allRoutes = [userRouter];
routers.use('/api', ...allRoutes);
export { routers };
