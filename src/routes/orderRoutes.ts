import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { OrderSchema } from '../schema/orderSchema';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import { authMiddleware, checkRole, rateLimiting } from '../middlewares/authMiddleware';

const orderRouter = Router();
// Checkout / create order
orderRouter.post(
  '/orders',
  rateLimiting(30),
  authMiddleware,
  checkRole(['customer']),
  ValidationMiddleware({ type: 'body', schema: OrderSchema }),
  OrderController.checkout,
);

// User routes
orderRouter.get(
  '/orders',
  rateLimiting(50),
  authMiddleware,
  checkRole(['customer']),
  OrderController.getUserOrders,
);

// Admin routes
orderRouter.get(
  '/orders/all',
  rateLimiting(50),
  authMiddleware,
  checkRole(['admin']),
  OrderController.getAllOrders,
);

// Seller routes
orderRouter.get(
  '/orders/seller',
  rateLimiting(50),
  authMiddleware,
  checkRole(['seller']),
  OrderController.getSellerOrders,
);

// Update order status (admin)
orderRouter.patch(
  '/orders/:orderId',
  rateLimiting(20),
  authMiddleware,
  checkRole(['admin']),
  ValidationMiddleware({ type: 'body', schema: OrderSchema}),
  OrderController.updateOrderStatus,
);

//  Get single order (admin, seller, customer - with service-level authorization)
orderRouter.get(
  '/orders/seller/:orderId',
  rateLimiting(30),
  authMiddleware,
  checkRole([ 'admin','seller']),
  OrderController.getSingleOrderForSeller,
);

// Customer get single order route
orderRouter.get(
  '/orders/customer/:orderId',
  rateLimiting(30),
  authMiddleware,
  checkRole(['admin','customer']),
  OrderController.getSingleOrderForCustomer,
);

// Admin get single order route
orderRouter.get(
  '/orders/admin/:orderId',
  rateLimiting(30),
  authMiddleware,
  checkRole(['admin']),
  OrderController.getSingleOrderForAdmin,
);


export { orderRouter };
