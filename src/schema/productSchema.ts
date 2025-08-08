import joi from "joi";

export const AddProductSchema = joi.object({
  name: joi.string().min(2).max(100).required(),
  description: joi.string().min(10).max(1000).required(),
  price: joi.number().min(0).required(),
  stock: joi.number().min(0).required(),
  productCatId: joi.string().uuid().required(),
  rating: joi.number().min(0).max(5).required(),
  variation: joi.string().valid("small", "medium", "large").required(),
  image: joi.array().items(joi.string().uri()).required(),
});
