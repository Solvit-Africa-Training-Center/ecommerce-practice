import Joi from "joi";

export const productSubCatSchema = Joi.object({
  productSubCatId: Joi.string().uuid(),
  name: Joi.string().min(2).max(100).required(),
  productCatId: Joi.string().uuid().required(),
});
