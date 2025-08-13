// route/userRoutse.ts

import { Router } from 'express';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import { getAllUsers, createUser, loginUser, logoutUser } from '../controllers/userController';
import { AddUserSchema, LoginUserSchema } from '../schema/userSchema';
import { authMiddleware, checkRole, rateLimiting } from '../middlewares/authMiddleware';

const userRouter = Router();

userRouter.get('/users', rateLimiting(50), authMiddleware, checkRole(['admin']), getAllUsers);

userRouter.post(
  '/users',
  rateLimiting(30),
  ValidationMiddleware({ type: 'body', schema: AddUserSchema }),
  createUser,
);

userRouter.post(
  '/login',
  ValidationMiddleware({ type: 'body', schema: LoginUserSchema }),
  loginUser,
);

userRouter.post('/logout', authMiddleware, logoutUser);

export { userRouter };
