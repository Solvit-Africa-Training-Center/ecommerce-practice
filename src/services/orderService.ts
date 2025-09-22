import { Order } from '../database/models/orderModel';
import { OrderItem } from '../database/models/orderItemModel';
import { Product } from '../database/models/Products';
import { Cart } from '../database/models/cartModel';
import { Database } from '../database';
import { IOrderCheckout, IOrderStatusUpdate } from '../types/orderInterface';
import { Role } from '../database/models/Roles';
import { User } from '../database/models/Users';

export class OrderService {

  // Checkout: convert cart to order
  static async checkoutOrder(userId: string, dto: IOrderCheckout) {
    const t = await Database.database.transaction();

    try {
      // 1. Fetch cart with items
      const cart = await Cart.findOne({
        where: { id: dto.cartId, userId },
        include: [{ association: 'items' }], // make sure 'items' is correct in Cart model
      });
      if (!cart) {throw new Error('Cart not found');}
      if (!cart.items || cart.items.length === 0) {throw new Error('Cart has no items');}

      console.log('Cart fetched:', cart.items.map(i => i.toJSON()));

      // 2. Validate stock and calculate total
      let totalAmount = 0;
      for (const item of cart.items) {
        const product = await Product.findByPk(item.productId);
        if (!product) {throw new Error(`Product ${item.productId} not found`);}
        if (product.stock < item.quantity) {throw new Error(`${product.name} stock insufficient`);}
        totalAmount += product.price * item.quantity;
      }

      // 3. Create Order
      const order = await Order.create({
        userId,
        shippingAddress: dto.shippingAddress,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        totalAmount,
      }, { transaction: t });

      console.log('Order created:', order.id);

      // 4. Create OrderItems & reduce stock
      for (const item of cart.items) {
        const product = await Product.findByPk(item.productId);
        if (!product) {continue;}

        await OrderItem.create({
          orderId: order.id,
          productId: product.id, 
          quantity: item.quantity,
          pricePerUnit: product.price,
        }, { transaction: t });

        product.stock -= item.quantity;
        await product.save({ transaction: t });
      }

      
      await Cart.destroy({ where: { id: dto.cartId }, transaction: t });

      await t.commit();

      // 6. Fetch order with items and product
      const createdOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: 'items', 
            include: [
              { model: Product, as: 'product' }, 
            ],
          },
        ],
      });

      console.log('Created order with items:', createdOrder?.toJSON());
      return createdOrder;

    } catch (err) {
      await t.rollback();
      console.error('Checkout failed:', err);
      throw err;
    }
  }

  static async getUserOrders(userId: string) {
    return Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });
  }

  // Get all orders (admin)
  static async getAllOrders() {
    return Order.findAll({
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });
  }

static async getSellerOrders(sellerId: string) {
  return Order.findAll({
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
          where: { userId: sellerId },
          },
        ],
      },
    ],
    where: {
      '$items.product.userId$': sellerId,
    },
  });
}
// seller can get single order which has his/her products
static async getSingleOrderForSeller(orderId: string, sellerId: string) {
  const order = await Order.findOne({
    where: { id: orderId },
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            where: { userId: sellerId }, // Only include products belonging to this seller
          },
        ],
      },
    ],
  });

  if (!order) {
    throw new Error('Order not found or you don\'t have permission to view it');
  }

  // Additional check to ensure the order actually contains the seller's products
  if (!order.items || order.items.length === 0) {
    throw new Error('This order doesn\'t contain any of your products');
  }

  return order;
}
// Customer can get single order which he/she ordered
static async getSingleOrderForCustomer(orderId: string, customerId: string) {
  const order = await Order.findOne({
    where: { 
      id: orderId,
      userId: customerId, // Only return orders that belong to this customer
    },
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'description', 'images'], // Include product details
          },
        ],
      },
    ],
  });

  if (!order) {
    throw new Error('Order not found or you don\'t have permission to view it');
  }

  return order;
}
  // Update order status
  static async updateOrderStatus(orderId: string, dto: IOrderStatusUpdate) {
    const order = await Order.findByPk(orderId);
    if (!order) {throw new Error('Order not found');}

    if (dto.orderStatus) {order.orderStatus = dto.orderStatus;}
    if (dto.paymentStatus) {order.paymentStatus = dto.paymentStatus;}

    await order.save();

    // Return updated order with items and products
    return Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });
  }

  // Admin can get any single order
static async getSingleOrderForAdmin(orderId: string) {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'description', 'images', 'userId'],
          },
        ],
      },
      {
        model: User, 
        as: 'user',
        attributes: ['id', 'email', 'name'],
      },
    ],
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
}
}
