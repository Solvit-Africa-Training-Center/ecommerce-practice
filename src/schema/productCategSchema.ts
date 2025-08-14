import Joi from 'joi';

export const AddProductCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
});
