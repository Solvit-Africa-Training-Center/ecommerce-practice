import joi from 'joi';

export const AddProductSchema = joi.object({
  name: joi.string().min(2).max(100).required(),
  description: joi.string().min(10).max(1000).required(),
  price: joi.number().min(0).required(),
  stock: joi.number().min(0).required(),
  productCatId: joi.string().uuid().required(),
  productSubCatId: joi.string().uuid().required(),
  variation: joi.object().optional().allow(null),
  image: joi.array().items(joi.string().uri()).required(),
  expiredAt: joi.date().optional(),
});

export const IdValidationSchema = joi.object({
  id: joi.string().min(24),
});
