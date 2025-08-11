// src/services/OrderServices.ts
import { Request, Response } from "express";
import { OrderItem } from "../database/models/OrderItems";
import { OrderInterface } from "../types/orderInterface";
import { ResponseService } from "../utils/response";
import { Order } from "../database/models/Orders";
import { Database } from "../database";
import { User } from "../database/models/Users";
import { Product } from "../database/models/products";
import { Identifier } from "sequelize";
import { MockCartService } from "./CartServices";

interface IRequestOrderData extends Request {
  body: OrderInterface & {
    userId: string;
    shippingAddress?: string;
    requestAddress?: string;
  };
}

export class OrderService {
  private cartService: MockCartService;

  constructor() {
    this.cartService = new MockCartService();
  }
  // make orders
  async makeOrder(req: IRequestOrderData, res: Response) {
    const { userId } = req.params;
    const { requestAddress } = req.body;

    if (!userId) {
      return ResponseService({
        res,
        status: 400,
        message: "User ID is required",
        data: null,
        success: false
      });
    }

    try {
      // Get user's cart items
      const cartItems = await this.cartService.getCartItems(userId);
      if (!cartItems?.length) {
        return ResponseService({
          res,
          status: 400,
          message: "Cart is empty",
          data: null,
          success: false
        });
      }

      // Prepare order items and check stock
      const orderItems = await Promise.all(
        cartItems.map(async (item: any) => {
          const product = await Product.findByPk(item.productId);
          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }
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

      // Calculate total amount
      const totalAmount = orderItems.reduce(
        (sum: number, item: { pricePerUnit: number; quantity: number; }) => sum + item.pricePerUnit * item.quantity,
        0
      );

      const transaction = await Database.database.transaction();

      try {
        // Get user with shipping address
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
          throw new Error("User not found");
        }

        // Use provided address or user's default address
        const shippingAddress = requestAddress || user.shippingAddress;
        if (!shippingAddress) {
          throw new Error("Shipping address is required");
        }

        // Create the order
        const order = await Order.create({
          userId,
          orderStatus: "pending",
          paymentStatus: "pending",
          totalAmount,
          shippingAddress,

        }, { transaction });

        // Create order items
        await OrderItem.bulkCreate(
          orderItems.map((item: any) => ({
            orderId: order.id,
            ...item
          })),
          { transaction }
        );

        // Update product stocks
        await this.updateProductStocks(orderItems, transaction);

        // Clear the cart
        await this.cartService.clearCart(userId, { transaction });

        // Update user's order history
        // await user.update({
        //   orderHistory: [...(user.orderHistory || []), order.id]
        // }, { transaction });

        await transaction.commit();

        return {
          orderId: order.id,
          totalAmount,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus
        };

      } catch (error) {
        await transaction.rollback();
        throw error;
      }

    } catch (error: any) {
      throw new Error(error.message || "Failed to create order");
    }
  }

  private async updateProductStocks(orderItems: any[], transaction: any) {
    await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findByPk(item.productId, { transaction });
        if (product) {
          await product.update({
            stock: product.stock - item.quantity
          }, { transaction });
        }
      })
    );
  }


  // ===============================================get order by id ===================================================================
  async getOrderById(orderId: string, userId?: string) {
    if (!orderId) {
      console.log("the Order Id in required please");
    }
    try {
      const order = await Order.findOne({
        where: { id: orderId }, include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
        {
          model: User,
          as: 'user'
        }]
      });
      if (!order) {
        throw new Error("Order not found");
      }
    }
    catch (error) {
      console.log("Failed to fetch order");
    }
  }

  //  =============================get All orders of single User=========================================================
  async getUserOrders(userId: string) {
    if (!userId) {
      throw new Error("User Id is required please!");
    }
    const orders = await Order.findAll({ where: { userId }, include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }], order: [['createdAt', 'DESC']] });
    return orders
  }
  // getting all orders in the E-commerce
  async getAllOrders() {
    const allOrders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
      {
        model: User, as: 'user'
      }],
      order: [['createdAt', 'DESC']]
    });
  }
  // ======================================cancelling order provided by user==================================================
  async cancelOrder(orderId: string, userId: string, userRole?: string) {
    const order = await Order.findOne({ where: { id: orderId }, include: ['items'] });
    if (!order) {
      throw new Error("Order not Found");
    }
    // to check if the user owned permission to cancel order
    if (order.userId !== userId && userRole !== 'admin') {
      throw new Error("Unauthorized to cancel this order");
    }
    // check if order can be cancelled
    if (order.orderStatus === 'cancelled') {
      throw new Error('Arleady order cancelled');
    }
    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      throw new Error('you can not cancell the order because it has arleady shipped');
    }
    await order.update(
      {
        orderStatus: 'cancelled',
        paymentStatus: 'pending'
      }
    );

    if (order.items) {
      await Promise.all(order.items.map(async (item: { productId: Identifier | undefined; quantity: any; }) => {
        const product = await Product.findByPk(item.productId);
        if (product) {
          await product.increment('stock', { by: item.quantity });
        }
      }))
    }
    return order
  }
  //========================================== update order ===================================================
  async updateOrder(orderId: string, userId: string, reqBody: Request['body'], userRole?: string) {

    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not Found");
    }
    if (order.userId !== userId && userRole !== 'admin') {
      throw new Error("Unauthorized to update this order");
    }
    const affectedOrder = await Order.update(reqBody, { where: { id: orderId } });
    return await Order.findByPk(orderId);
  }
}



