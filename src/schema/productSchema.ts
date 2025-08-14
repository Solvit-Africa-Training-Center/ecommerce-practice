import joi from 'joi';

export const AddProductSchema = joi.object({
  name: joi.string().min(2).max(100).required(),
  description: joi.string().min(10).max(1000).required(),
  price: joi.number().min(0).required(),
  stock: joi.number().min(0).required(),
  productCatId: joi.string().uuid().required(),
  productSubCatId: joi.string().uuid().required(),
  // images: joi.array().min(4).max(8).required().messages({
  //   "array.base": "Images must be an array of URIs",
  //   "array.min": "Images must have at least 4 items",
  //   "array.max": "Images can have up to 8 items",
  //   "any.required": "Images are required",
  // }),
  variation: joi.object().optional().allow(null),
  expiredAt: joi.date().optional(),
});

export const IdValidationSchema = joi.object({
  id: joi.string().min(24),
});
