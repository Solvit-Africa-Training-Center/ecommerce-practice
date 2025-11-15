import joi from 'joi';
import { UuidIdSchema } from './commonSchemas';

export const AddUserSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

export const LoginUserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const UserParamsSchema = UuidIdSchema;

export const ForgotPasswordSchema = joi.object({
  email: joi.string().email().required(),
});

export const ResetPasswordSchema = joi.object({
  token: joi.string().required(),
  newPassword: joi.string().min(8).required(),
});