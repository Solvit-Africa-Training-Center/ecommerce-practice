import { Response } from 'express';
import { OrderService } from '../services/orderService';
import { IOrderCheckout, IOrderStatusUpdate } from '../types/orderInterface';
import { ResponseService } from '../utils/response';
import { IRequestUser } from '../middlewares/authMiddleware';

export class OrderController {
  // Checkout cart
  static async checkout(req: IRequestUser, res: Response): Promise<Response> {
    try {
      if (!req.user || !req.user.id) {
        return ResponseService({
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized: user not found',
          res,
        });
      }

      const userId = req.user.id;
      const dto: IOrderCheckout = req.body;
      const order = await OrderService.checkoutOrder(userId, dto);

      return ResponseService({
        message: 'Order created successfully',
        status: 201,
        data: order,
        success: true,
        res,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      return ResponseService({
        message,
        status: 400,
        success: false,
        data: null,
        res,
      });
    }
  }

  // Get user orders
  static async getUserOrders(req: IRequestUser, res: Response): Promise<Response> {
    try {
      if (!req.user || !req.user.id) {
        return ResponseService({
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized: user not found',
          res,
        });
      }

      const userId = req.user.id;
      const orders = await OrderService.getUserOrders(userId);

      return ResponseService({
        message: 'User orders fetched successfully',
        status: 200,
        data: orders,
        success: true,
        res,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      return ResponseService({
        message,
        status: 400,
        success: false,
        data: null,
        res,
      });
    }
  }

  // Get all orders (admin)
  static async getAllOrders(req: IRequestUser, res: Response): Promise<Response> {
    try {
      const orders = await OrderService.getAllOrders();

      return ResponseService({
        message: 'All orders fetched successfully',
        status: 200,
        data: orders,
        success: true,
        res,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch all orders';
      return ResponseService({
        message,
        status: 400,
        success: false,
        data: null,
        res,
      });
    }
  }

  // Update order status (admin)
  static async updateOrderStatus(req: IRequestUser, res: Response): Promise<Response> {
    try {
      const { orderId } = req.params;
      const dto: IOrderStatusUpdate = req.body;

      const order = await OrderService.updateOrderStatus(orderId, dto);

      return ResponseService({
        message: 'Order status updated successfully',
        status: 200,
        data: order,
        success: true,
        res,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update order status';
      return ResponseService({
        message,
        status: 400,
        success: false,
        data: null,
        res,
      });
    }
  }

  // Seller orders
  static async getSellerOrders(req: IRequestUser, res: Response): Promise<Response> {
    try {
      const sellerId = req.user?.id as string;
      const orders = await OrderService.getSellerOrders(sellerId);

      return ResponseService({
        message: 'Seller orders fetched successfully',
        status: 200,
        data: orders,
        success: true,
        res,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch seller orders';
      return ResponseService({
        message,
        status: 400,
        success: false,
        data: null,
        res,
      });
    }
  }

  // Seller single order
  static async getSingleOrderForSeller(req: IRequestUser, res: Response): Promise<Response> {
    try {
      if (!req.user?.id) {
        return ResponseService({
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized: user not found',
          res,
        });
      }

      const { orderId } = req.params;
      const userId = req.user.id;
      const order = await OrderService.getSingleOrderForSeller(orderId, userId);

      return ResponseService({
        message: 'Order fetched successfully',
        status: 200,
        data: order,
        success: true,
        res,
      });
    } catch (err: unknown) {
      let status = 400;
      let message = err instanceof Error ? err.message : 'Failed to fetch order';

      if (message.includes('Unauthorized')) {
        status = 403;
        message = 'Access denied: You don’t have permission to view this order';
      } else if (message.includes('not found')) {
        status = 404;
        message = 'Order not found';
      }

      return ResponseService({
        message,
        status,
        success: false,
        data: null,
        res,
      });
    }
  }

  // Customer single order
  static async getSingleOrderForCustomer(req: IRequestUser, res: Response): Promise<Response> {
    try {
      if (!req.user?.id) {
        return ResponseService({
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized: user not found',
          res,
        });
      }

      const { orderId } = req.params;
      const customerId = req.user.id;

      if (!orderId) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: 'Order ID is required',
          res,
        });
      }

      const order = await OrderService.getSingleOrderForCustomer(orderId, customerId);

      return ResponseService({
        message: 'Order fetched successfully',
        status: 200,
        data: order,
        success: true,
        res,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch order';
      const status = message.includes('not found') ? 404 : 400;

      return ResponseService({
        message,
        status,
        success: false,
        data: null,
        res,
      });
    }
  }

  // Admin single order
  static async getSingleOrderForAdmin(req: IRequestUser, res: Response): Promise<Response> {
    try {
      if (!req.user?.id) {
        return ResponseService({
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized: user not found',
          res,
        });
      }

      const { orderId } = req.params;

      if (!orderId) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: 'Order ID is required',
          res,
        });
      }

      const order = await OrderService.getSingleOrderForAdmin(orderId);

      return ResponseService({
        message: 'Order fetched successfully',
        status: 200,
        data: order,
        success: true,
        res,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch order';
      const status = message.includes('not found') ? 404 : 400;

      return ResponseService({
        message,
        status,
        success: false,
        data: null,
        res,
      });
    }
  }
}
