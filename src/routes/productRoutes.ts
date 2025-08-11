import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import { AddProductSchema, IdValidationSchema } from '../schema/productSchema';
import { authMiddleware, checkRole, rateLimiting } from '../middlewares/authMiddleware';
import { AddProductCategorySchema } from '../schema/productCategSchema';
import { productSubCatSchema } from '../schema/productSubCatSchema';

const productRoutes = Router();
const controller = new ProductController();

// product category routes
productRoutes.get('/categories', controller.viewAllCategories);
productRoutes.get('/categories/:name', controller.viewSingleCategory);
productRoutes.post(
  '/categories',
  rateLimiting(30),
  authMiddleware,
  checkRole(['admin', 'seller']),
  ValidationMiddleware({ type: 'body', schema: AddProductCategorySchema }),
  controller.createCategory,
);
productRoutes.patch(
  '/categories/:id',
  authMiddleware,
  checkRole(['admin', 'seller']),
  ValidationMiddleware({ type: 'body', schema: AddProductCategorySchema }),
  controller.updateCategory,
);
productRoutes.delete(
  '/categories/:id',
  authMiddleware,
  checkRole(['admin', 'seller']),
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.deleteCategory,
);

// product sub-category routes

productRoutes.get('/sub-categories', controller.viewAllSubCategories);
productRoutes.get('/sub-categories/:name', controller.viewSingleSubCategory);
productRoutes.post(
  '/sub-categories',
  rateLimiting(30),
  authMiddleware,
  checkRole(['admin', 'seller']),
  ValidationMiddleware({ type: 'body', schema: productSubCatSchema }),
  controller.createSubCategory,
);
productRoutes.patch(
  '/sub-categories/:id',
  authMiddleware,
  checkRole(['admin', 'seller']),
  ValidationMiddleware({ type: 'body', schema: productSubCatSchema }),
  controller.updateSubCategory,
);
productRoutes.delete(
  '/sub-categories/:id',
  authMiddleware,
  checkRole(['admin', 'seller']),
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.deleteSubCategory,
);

// product routes

productRoutes.get('/products', controller.viewAllProducts);
productRoutes.get('/products/:id', controller.viewSingleProduct);
productRoutes.post(
  '/products',
  rateLimiting(30),
  authMiddleware,
  checkRole(['admin', 'seller']),
  ValidationMiddleware({ type: 'body', schema: AddProductSchema }),
  controller.createProduct,
);
productRoutes.patch(
  '/products/:id',
  authMiddleware,
  checkRole(['admin', 'seller']),
  ValidationMiddleware({ type: 'body', schema: AddProductSchema }),
  controller.updateProduct,
);
productRoutes.delete(
  '/products/:id',
  authMiddleware,
  checkRole(['admin', 'seller']),
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.deleteProduct,
); //admin

export { productRoutes };
