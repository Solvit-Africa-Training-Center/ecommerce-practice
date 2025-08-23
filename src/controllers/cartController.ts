import { Response } from 'express';
import { CartService } from '../services/cartService';
import { IRequestUser } from '../types/cartInterface';
import { addCartItemSchema, updateCartItemSchema, removeCartItemSchema } from '../schema/CartSchema';
import { ResponseService } from '../utils/response';

export class CartController {
  
  static async getCart(req: IRequestUser, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        ResponseService({
          res,
          status: 401,
          message: 'Unauthorized ',
          success: false,
          data: null,
        });
        return;
      }

      const cart = await CartService.getCartByUserId(req.user.id);
      ResponseService({
        res,
        status: 200,
        message: 'Cart retrieved successfully.',
        success: true,
        data: cart || { id: null, userId: req.user.id, items: [], totalPrice: 0 },
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        status: 500,
        success: false,
        res,
      });
    }
  }

  // Add item to cart
  static async addItem(req: IRequestUser, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        ResponseService({
          res,
          status: 401,
          message: 'Unauthorized ',
          success: false,
          data: null,
        });
        return;
      }

      const { error } = addCartItemSchema.validate(req.body);
      if (error) {
        ResponseService({
          res,
          status: 400,
          message: error.details[0].message,
          success: false,
          data: null,
        });
        return;
      }

      const newItem = await CartService.addItem(req.user.id, req.body);
      ResponseService({
        res,
        status: 201,
        message: 'Item added to cart successfully.',
        success: true,
        data: newItem,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        status: 500,
        success: false,
        res,
      });
    }
  }

  // Update cart item
  static async updateItem(req: IRequestUser, res: Response): Promise<void> {
    try {
      const { error } = updateCartItemSchema.validate(req.body);
      if (error) {
        ResponseService({
          res,
          status: 400,
          message: error.details[0].message,
          success: false,
          data: null,
        });
        return;
      }

      const updatedItem = await CartService.updateItem(req.params.cartItemId, req.body.quantity);
      if (!updatedItem) {
        ResponseService({
          res,
          status: 404,
          message: 'Cart item not found.',
          success: false,
          data: null,
        });
        return;
      }

      ResponseService({
        res,
        status: 200,
        message: 'Cart item updated successfully.',
        success: true,
        data: updatedItem,
      });

    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        status: 500,
        success: false,
        res,
      });
      return;
    }
  }

  // Remove cart item
  static async removeItem(req: IRequestUser, res: Response): Promise<void> {
    try {
      const { error } = removeCartItemSchema.validate(req.body);
      if (error) {
      ResponseService({
          res,
          status: 400,
          message: error.details[0].message,
          success: false,
          data: null,
        });
        return;
      }

      await CartService.removeItem(req.body.cartItemId);
      ResponseService({
        res,
        status: 200,
        message: 'Item removed from cart successfully.',
        success: true,
        data: null,
      });
    } catch (error) {
     const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        status: 500,
        success: false,
        res,
      });
      return;
    }
  }

  // Clear entire cart
  static async clearCart(req: IRequestUser, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        ResponseService({
          res,
          status: 401,
          message: 'Unauthorized ',
          success: false,
          data: null,
        });
        return;
      }

      const cart = await CartService.getCartByUserId(req.user.id);
      if (!cart?.id) {
        ResponseService({
          res,
          status: 404,
          message: 'Cart not found.',
          success: false,
          data: null,
        });
        return;
      }

      await CartService.clearCart(cart.id);
      ResponseService({
        res,
        status: 200,
        message: 'Cart cleared successfully.',
        success: true,
        data: null,
      });
    } catch (error) {
         const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        status: 500,
        success: false,
        res,
      });
      return;
    }
  }
}
