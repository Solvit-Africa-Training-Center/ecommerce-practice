import { Response } from 'express';
import { CartService } from '../services/cartService';
import { IRequestUser } from '../types/cartInterface';
import { addCartItemSchema, updateCartItemSchema, removeCartItemSchema } from '../schema/CartSchema';
import { ResponseService } from '../utils/response';
import { remove } from 'winston';

export class CartController {

  // Get user's cart
  static async getCart(req: IRequestUser, res: Response): Promise<void> {
    try {
      await CartService.getCartByUserId(req.user?.id as string, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  // Add item to cart
  static async addItem(req: IRequestUser, res: Response): Promise<void> {
    try {
      await CartService.addItem(req.user?.id as string, req.body, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  // Update cart item quantity
  static async updateItem(req: IRequestUser, res: Response): Promise<void> {
    try {
      await CartService.updateItem(req.params.cartItemId, req.body.quantity, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  // Remove one item on cart
  static async removeItem(req: IRequestUser, res: Response): Promise<void> {
    try {
      await CartService.removeItem(req.params.cartItemId, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }

  //Remove All items on cart
  static async clearCart(req: IRequestUser, res: Response): Promise<void> {
    try {
      await CartService.clearCart(req.params.cartId, res);
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res,
      });
    }
  }
}