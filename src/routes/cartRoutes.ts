import { Router } from 'express';
import { CartController } from '../controllers/cartController';
import { authMiddleware, checkRole } from '../middlewares/authMiddleware';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import { addCartItemSchema, updateCartItemSchema, removeCartItemSchema } from '../schema/CartSchema';

const cartRoutes = Router();

// Get cart (admin or customer)
cartRoutes.get(
  '/carts',
  authMiddleware,
  checkRole(['admin', 'customer']),
  CartController.getCart
);

//  Add item (admin or customer)
cartRoutes.post(
  '/carts',
  authMiddleware,
  checkRole(['admin', 'customer']),
  ValidationMiddleware({ type: 'body', schema: addCartItemSchema }),
  CartController.addItem
);

//  Update item (admin or customer)
cartRoutes.put(
  '/carts/:cartItemId',
  authMiddleware,
  checkRole(['admin', 'customer']),
  ValidationMiddleware({ type: 'body', schema: updateCartItemSchema }),
  CartController.updateItem
);

//  Remove one item (admin or customer)
cartRoutes.delete(
  '/carts',
  authMiddleware,
  checkRole(['admin', 'customer']),
  ValidationMiddleware({ type: 'body', schema: removeCartItemSchema }),
  CartController.removeItem
);

// Clear entire cart (admin only)
cartRoutes.delete(
  '/carts/clear',
  authMiddleware,
  checkRole(['admin']),
  CartController.clearCart
);

export { cartRoutes };
