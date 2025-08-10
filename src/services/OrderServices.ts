import { Request, Response } from "express";
import { OrderItem } from "../database/models/OrderItems";
import { OrderInterface } from "../types/orderInterface";
import { ResponseService } from "../utils/response";
import { mockCartService, mockProductService, OrderItemData } from "./morckerServices";
import { Order } from "../database/models/Orders";
import { Database } from "../database";
import { User } from "../database/models/Users";


interface IRequestOrderData extends Request {
  body: OrderInterface & { userId?: string; shippingAddress?:string };
}

export const makeOrder = async (req: IRequestOrderData, res: Response) => {
  const { id, shippingAddress: requestAddress } = req.body; 
  if (!id) {
    return ResponseService({
      res,
      status: 400,
      message: "User ID is required",
      data: null,
      success: false
    });
  }

  const cartService = mockCartService;
  const productService = mockProductService;

  try {
    const cartItems = await cartService.getCartItems(id);
    if (!cartItems?.length) {
      return ResponseService({
        res,
        status: 400,
        message: "Cart is empty",
        data: null,
        success: false
      });
    }

    const orderItems: OrderItemData[] = await Promise.all(
      cartItems.map(async (item) => {
        const product = await productService.getProductById(item.productId);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        return {
          productId: item.productId,
          quantity: item.quantity,
          pricePerUnit: product.price,
        };
      })
    );

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.pricePerUnit * item.quantity,
      0
    );

    const transaction = await Database.database.transaction();

    try {
      const user = await User.getUserById(id) as unknown as {
        shippingAddress: string;
        orderHistory: string[];
        save(opts?: { transaction: any }): Promise<void>;
      };
      const shippingAddress = requestAddress || user.shippingAddress;
     if (!user.shippingAddress) {
      throw new Error("User shipping address is required");
      }
      const order = await Order.create({
        id,
        orderStatus: "pending",
        paymentStatus: "pending",
        totalAmount,
        shippingAddress,
        userId: ""
      }, { transaction });

      await OrderItem.bulkCreate(
        orderItems.map(item => ({
          orderId: order.id,
          ...item
        })),
        { transaction }
      );

      await updateProductStocks(orderItems, transaction);
      await cartService.clearCart(id, { transaction });

      user.orderHistory.push(order.id.toString());
      await user.save({ transaction });

      await transaction.commit();

      return ResponseService({
        res,
        status: 201,
        message: "Order created successfully",
        data: { orderId: order.id, totalAmount },
        success: true,
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error: any) {
    return ResponseService({
      res,
      status: 500,
      message: error.message || "Internal server error",
      data: null,
      success: false
    });
  }
};

function updateProductStocks(orderItems: OrderItemData[], transaction: any) {
  // TODO: Implement stock deduction logic
  return Promise.resolve();
}
