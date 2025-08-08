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
  authMiddleware,
  ValidationMiddleware({ type: 'body', schema: AddProductCategorySchema}),
  controller.createCategory,
); //admin
productRoutes.patch(
  '/categories/:id',
  authMiddleware,
  ValidationMiddleware({ type: 'body', schema: AddProductCategorySchema}),
  controller.updateCategory,
); //admin
// productRoutes.delete('/categories/:id',authMiddleware,ValidationMiddleware({type:'params', schema:IdValidationSchema}),controller.deleteCategory); //admin

// // product sub-category routes
productRoutes.get('/sub-categories',controller.viewAllSubCategories);
productRoutes.get('/sub-categories/:name', controller.viewSingleSubCategory);
productRoutes.post(
  '/sub-categories',
  authMiddleware,
  ValidationMiddleware({ type: 'body', schema:productSubCatSchema}),
  controller.createSubCategory,
); //admin
productRoutes.patch(
  '/sub-categories/:id',
  authMiddleware,
  ValidationMiddleware({ type: 'body', schema:productSubCatSchema}),
  controller.updateSubCategory,
); //admin
// productRoutes.delete('/sub-categories/:id',authMiddleware,ValidationMiddleware({type:'params', schema:IdValidationSchema}),controller.deleteSubCategory); //admin


// product routes
productRoutes.get('/products', controller.viewAllProducts);
productRoutes.get('/products/:id', controller.viewSingleProduct);
productRoutes.post(
  '/products',
  authMiddleware,
  ValidationMiddleware({ type: 'body', schema: AddProductSchema }),
  controller.createProduct,
); // admin
productRoutes.patch(
  '/products/:id',
  authMiddleware,
  ValidationMiddleware({ type: 'body', schema: AddProductSchema }),
  controller.updateProduct,
); // admin
productRoutes.delete(
  '/products/:id',
  authMiddleware,
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  controller.deleteProduct,
); //admin

export { productRoutes };
