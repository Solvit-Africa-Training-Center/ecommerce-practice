import { Router } from "express";
import { orderController } from "../controllers/orderController";
const orderRoutes = Router();
orderRoutes.post("/makeOrders", orderController.createOrder.bind(orderController)); 
export { orderRoutes };