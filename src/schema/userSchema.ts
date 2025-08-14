
import joi from 'joi';

export const AddUserSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

export const LoginUserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const UserParamsSchema = joi.object({
  id: joi.string().min(24),
});

// coupon
export const AddCouponSchema = joi.object({
  code: joi.string().required(),
  discount: joi.number().min(0).required(),
  expiredDate: joi.date().greater('now').required(),
});
