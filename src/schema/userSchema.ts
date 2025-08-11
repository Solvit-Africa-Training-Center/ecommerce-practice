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

// Profile validation schemas
export const CreateProfileSchema = joi.object({
  userId: joi.string().uuid().required(),
  phone: joi.string().optional(),
  bio: joi.string().max(500).optional(),
  gender: joi.string().valid('male', 'female', 'other').optional(),
  dateOfBirth: joi.date().max('now').optional(),
  country: joi.string().optional(),
  city: joi.string().optional(),
  address: joi.string().optional(),
  isVerified: joi.boolean().optional(),
  isActive: joi.boolean().optional(),
});

export const UpdateProfileSchema = joi.object({
  phone: joi.string().optional(),
  bio: joi.string().max(500).optional(),
  gender: joi.string().valid('male', 'female', 'other').optional(),
  dateOfBirth: joi.date().max('now').optional(),
  country: joi.string().optional(),
  city: joi.string().optional(),
  address: joi.string().optional(),
  isVerified: joi.boolean().optional(),
  isActive: joi.boolean().optional(),
});

export const ProfileParamsSchema = joi.object({
  userId: joi.string().uuid().required(),
});
