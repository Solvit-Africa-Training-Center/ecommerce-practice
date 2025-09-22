export interface IOrderCheckout {
  cartId: string;
  shippingAddress: string;
  paymentMethod: 'card' | 'mobileMoney' | 'banktransfer';
}
export interface IOrderStatusUpdate {
  orderStatus?: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
}
