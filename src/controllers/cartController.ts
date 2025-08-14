import { Response } from 'express';
import { CartService } from '../services/cartService';
import { IRequestUser } from '../types/cartInterface';
import { addCartItemSchema, updateCartItemSchema, removeCartItemSchema } from '../schema/CartSchema';
import { ResponseService } from '../utils/response';

export class CartController {
  
  static async getCart(req: IRequestUser, res: Response): Promise<Response> {
    try {
      if (!req.user?.id) {
        return ResponseService({
          res,
          status: 401,
          message: 'Unauthorized ',
          success: false,
          data: null,
        });
      }

      const cart = await CartService.getCartByUserId(req.user.id);
      return ResponseService({
        res,
        status: 200,
        message: 'Cart retrieved successfully.',
        success: true,
        data: cart || { id: null, userId: req.user.id, items: [], totalPrice: 0 },
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to retrieve cart.';
      return res.status(500).json({ message: errMsg });
    }
  }

  // Add item to cart
  static async addItem(req: IRequestUser, res: Response): Promise<Response> {
    try {
      if (!req.user?.id) {
        return ResponseService({
          res,
          status: 401,
          message: 'Unauthorized ',
          success: false,
          data: null,
        });
      }

      const { error } = addCartItemSchema.validate(req.body);
      if (error) {
        return ResponseService({
          res,
          status: 400,
          message: error.details[0].message,
          success: false,
          data: null,
        });
      }

      const newItem = await CartService.addItem(req.user.id, req.body);
      return ResponseService({
        res,
        status: 201,
        message: 'Item added to cart successfully.',
        success: true,
        data: newItem,
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to add item to cart.';
      return res.status(500).json({ message: errMsg });
    }
  }

  // Update cart item
  static async updateItem(req: IRequestUser, res: Response): Promise<Response> {
    try {
      const { error } = updateCartItemSchema.validate(req.body);
      if (error) {
        return ResponseService({
          res,
          status: 400,
          message: error.details[0].message,
          success: false,
          data: null,
        });
      }

      const updatedItem = await CartService.updateItem(req.params.cartItemId, req.body.quantity);
      if (!updatedItem) {
        return ResponseService({
          res,
          status: 404,
          message: 'Cart item not found.',
          success: false,
          data: null,
        });
      }

      return ResponseService({
        res,
        status: 200,
        message: 'Cart item updated successfully.',
        success: true,
        data: updatedItem,
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to update cart item.';
      return res.status(500).json({ message: errMsg });
    }
  }

  // Remove cart item
  static async removeItem(req: IRequestUser, res: Response): Promise<Response> {
    try {
      const { error } = removeCartItemSchema.validate(req.body);
      if (error) {
        return ResponseService({
          res,
          status: 400,
          message: error.details[0].message,
          success: false,
          data: null,
        });
      }

      await CartService.removeItem(req.body.cartItemId);
      return ResponseService({
        res,
        status: 200,
        message: 'Item removed from cart successfully.',
        success: true,
        data: null,
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to remove item from cart.';
      return res.status(500).json({ message: errMsg });
    }
  }

  // Clear entire cart
  static async clearCart(req: IRequestUser, res: Response): Promise<Response> {
    try {
      if (!req.user?.id) {
        return ResponseService({
          res,
          status: 401,
          message: 'Unauthorized ',
          success: false,
          data: null,
        });
      }

      const cart = await CartService.getCartByUserId(req.user.id);
      if (!cart?.id) {
        return ResponseService({
          res,
          status: 404,
          message: 'Cart not found.',
          success: false,
          data: null,
        });
      }

      await CartService.clearCart(cart.id);
      return ResponseService({
        res,
        status: 200,
        message: 'Cart cleared successfully.',
        success: true,
        data: null,
      });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to clear cart.';
      return res.status(500).json({ message: errMsg });
    }
  }
}
