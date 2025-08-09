export interface OrderInterface {
    id?: string;
    userId: string;
    orderStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    totalAmount: number;
    shippingAddress: string;
    trackingNumber?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export interface OrderCreationInterface
  extends Omit<OrderInterface, "id" | "createdAt" | "updatedAt" | "deletedAt"> {
  id?: string;
}

export interface OrderWithItemsInterface extends OrderInterface {
  items: OrderItemInterface[];
}
// here is about the OrderItemInterface
export interface OrderItemInterface {
  id?: string;
  orderId: string;
  productId: string;
  quantity: number;
  pricePerUnit: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface OrderItemCreationInterface
  extends Omit<OrderItemInterface, "id" | "createdAt" | "updatedAt" | "deletedAt"> {
  id?: string;
}
export interface GetAllOrders {
  orders: OrderWithItemsInterface[];
}
export interface AddOrderInterface
  extends Omit<OrderInterface, "createdAt" | "updatedAt"> {
  items: OrderItemCreationInterface[];
}
export interface UpdateOrderInterface
  extends Omit<OrderInterface, "createdAt" | "updatedAt" | "deletedAt"> {
  items?: OrderItemCreationInterface[];
}
export interface UpdateOrderStatusInterface {
  orderId: string;
  orderStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
}
export interface DeleteOrderInterface {
  orderId: string;
}

