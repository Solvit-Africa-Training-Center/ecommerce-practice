import joi from 'joi';

// Common validation schemas that can be reused across the application

/**
 * UUID validation for primary key IDs (used in routes like /:id)
 */
export const UuidIdSchema = joi.object({
  id: joi.string().uuid().required(),
});

/**
 * UUID validation for product ID parameter (used in rating routes like /:productId)
 */
export const ProductIdParamSchema = joi.object({
  productId: joi.string().uuid().required(),
});

/**
 * UUID validation for category ID parameter
 */
export const CategoryIdParamSchema = joi.object({
  categoryId: joi.string().uuid().required(),
});

/**
 * UUID validation for sub-category ID parameter
 */
export const SubCategoryIdParamSchema = joi.object({
  subCategoryId: joi.string().uuid().required(),
});

/**
 * UUID validation for user ID parameter
 */
export const UserIdParamSchema = joi.object({
  userId: joi.string().uuid().required(),
});

/**
 * Pagination query parameters
 */
export const PaginationQuerySchema = joi.object({
  page: joi.number().integer().min(1).default(1),
  limit: joi.number().integer().min(1).max(100).default(10),
});

/**
 * Search query parameters
 */
export const SearchQuerySchema = joi.object({
  search: joi.string().min(1).max(100).optional(),
  sortBy: joi.string().valid('name', 'price', 'createdAt', 'updatedAt').optional(),
  sortOrder: joi.string().valid('asc', 'desc').default('desc').optional(),
});
