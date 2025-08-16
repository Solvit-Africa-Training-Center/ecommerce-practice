import { Router } from 'express';
import { CartController } from '../controllers/cartController';
import { authMiddleware} from '../middlewares/authMiddleware';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import { addCartItemSchema, updateCartItemSchema, removeCartItemSchema } from '../schema/CartSchema';

const cartRoutes = Router();

cartRoutes.get('/carts', authMiddleware, CartController.getCart);
cartRoutes.post('/carts', authMiddleware, ValidationMiddleware({ type: 'body', schema: addCartItemSchema }), CartController.addItem);
cartRoutes.put('/carts/:cartItemId', authMiddleware, ValidationMiddleware({ type: 'body', schema: updateCartItemSchema }), CartController.updateItem);
cartRoutes.delete('/carts', authMiddleware, ValidationMiddleware({ type: 'body', schema: removeCartItemSchema }), CartController.removeItem);
cartRoutes.delete('/carts/clear', authMiddleware, CartController.clearCart);

export {cartRoutes};
