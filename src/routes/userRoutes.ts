import { Router } from 'express';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import { getAllUsers, createUser, loginUser, logoutUser, forgotPassword, resetPassword } from '../controllers/userController';
import { AddUserSchema, LoginUserSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../schema/userSchema';
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

userRouter.post(
  '/forgot-password',
  ValidationMiddleware({ type: 'body', schema: ForgotPasswordSchema }),
  forgotPassword,
);

userRouter.post(
  '/reset-password',
  ValidationMiddleware({ type: 'body', schema: ResetPasswordSchema }),
  resetPassword,
);

export { userRouter };
