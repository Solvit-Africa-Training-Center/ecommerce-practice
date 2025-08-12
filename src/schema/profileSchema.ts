import joi from 'joi';
 
export const CreateProfileSchema = joi.object({
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


