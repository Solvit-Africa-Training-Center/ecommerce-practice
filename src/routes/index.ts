import { Router } from 'express';
import { userRouter } from './userRoutes';
import { profileRouter } from './profileRoutes';

const routers = Router();
const allRoutes = [userRouter, profileRouter];
routers.use('/api', ...allRoutes);
export { routers };
