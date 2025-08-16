import { Cart } from '../database/models/cartModel';
import { CartItem } from '../database/models/cartItemModel';
import { Product } from '../database/models/Products';
import { ICart,ICartItem } from '../types/cartInterface';

export class CartService {
    
  
  static async getCartByUserId(userId: string): Promise<ICart> {
  // Find cart for user
  let cart = await Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    ],
  });

  // If cart doesn't exist, create an empty one
  if (!cart) {
    cart = await Cart.create({ userId });
    return {
      id: cart.id,
      userId: cart.userId,
      items: [],
      totalPrice: 0,
    };
  }

  // Map cart items and calculate totals
  const items = cart.items?.map((item: CartItem) => ({
    ...item.toJSON(),
    totalprice: Number(item.price) * item.quantity,
  }));

  const totalPrice = items?.reduce((acc, i) => acc + (i.totalprice ?? 0), 0) ?? 0;

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    totalPrice,
  };
}


  // Add item to cart
  static async addItem(userId: string, data: ICartItem): Promise<ICartItem> {
    // Find or create cart
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    const product = await Product.findByPk(data.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const totalprice = Number(product.price) * data.quantity;

    const cartItem = await CartItem.create({
      cartId: cart.id,
      productId: data.productId,
      quantity: data.quantity,
      price: Number(product.price),
     totalprice,
    });

    return cartItem;
  }

  
  static async updateItem(cartItemId: string, quantity: number): Promise<ICartItem | null> {
    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) {
      return null;
    }

    cartItem.quantity = quantity;
    cartItem.totalprice = Number(cartItem.price) * quantity;
    await cartItem.save();

    return cartItem;
  }

  
  static async removeItem(cartItemId: string): Promise<void> {
    await CartItem.destroy({ where: { id: cartItemId } });
  }

  // Clear entire cart
  static async clearCart(cartId: string): Promise<void> {
    await CartItem.destroy({ where: { cartId } });
  }
}
