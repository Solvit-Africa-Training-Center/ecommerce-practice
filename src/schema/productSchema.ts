import joi from 'joi';
import { UuidIdSchema } from './commonSchemas';

export const CreateProductSchema = joi.object({
  name: joi.string().min(2).max(100).required(),
  description: joi.string().min(10).max(1000).required(),
  price: joi.number().min(0).required(),
  stock: joi.number().min(0).required(),
  productCatId: joi.string().uuid().required(),
  productSubCatId: joi.string().uuid().required(),
  variation: joi.object().optional().allow(null),
  expiredAt: joi.date().optional(),
  isAvailable: joi.boolean().optional().default(true),
});

export const UpdateProductSchema = joi.object({
  name: joi.string().min(2).max(100).optional(),
  description: joi.string().min(10).max(1000).optional(),
  price: joi.number().min(0).optional(),
  stock: joi.number().min(0).optional(),
  productCatId: joi.string().uuid().optional(),
  productSubCatId: joi.string().uuid().optional(),
  variation: joi.object().optional().allow(null),
  expiredAt: joi.date().optional(),
  isAvailable: joi.boolean().optional(),
});

export const IdValidationSchema = UuidIdSchema;
