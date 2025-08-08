import Joi from 'joi';

export const productSubCatSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  productCatId: Joi.string().uuid().required(),
});
