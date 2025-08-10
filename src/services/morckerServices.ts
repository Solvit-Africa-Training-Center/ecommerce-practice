import { createUser } from "../controllers/userController";

// Add these interfaces at the top
interface DummyCartItem {
  productId: string;
  quantity: number;
}

interface DummyProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
}
export interface OrderItemData {
  productId: string;
  quantity: number;
  pricePerUnit: number;
}
// Mock services for testing (temporary)
 export const mockCartService = {
  getCartItems: async (userId: string): Promise<DummyCartItem[]> => {
    return [
      { productId: "prod-1", quantity: 2 },
      { productId: "prod-2", quantity: 1 }
    ];
  },
  clearCart: async (userId: string, p0: { transaction: any; }) => {
    console.log("Cart cleared for user:", userId);
  }
};

 export const mockProductService = {
  getProductById: async (id: string): Promise<DummyProduct> => {
    const products: Record<string, DummyProduct> = {
      "prod-1": { id: "prod-1", name: "iPhone 15", price: 999, stock: 10 },
      "prod-2": { id: "prod-2", name: "MacBook Pro", price: 1999, stock: 5 }
    };
    return products[id] || null;
  }
};
// Add mock database storage
const mockUsersDB: Record<string, any> = {
  "123ed567-e89b-12d3-a456-426614174000": {
    id: "123ed567-e89b-12d3-a456-426614174000",
    name: "Test User",
    email: "test@example.com",
    shippingAddress: "123 Main St, Kigali, Rwanda",
    orderHistory: []
  }
};

