// src/controllers/OrderController.ts
import { Request, Response } from "express";
import { OrderService } from "../services/OrderServices";
import { ResponseService } from "../utils/response";

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    public async createOrder(req: Request, res: Response) {
        const { userId } = req.params;

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
            const orderData = await this.orderService.makeOrder(req as any, res);

            return ResponseService({
                res,
                status: 201,
                message: "Order created successfully",
                data: orderData,
                success: true,
            });
        } catch (err: any) {
            return ResponseService({
                res,
                status: 500,
                message: err.message || "Failed to create order",
                data: null,
                success: false,
            });
        }
    }

    // to get single order of user
    public async getOrder(req: Request, res: Response) {
        const { orderId } = req.params;
        const userId = req.user?.id;

        if (!orderId) {
            return ResponseService({
                data: null,
                status: 400,
                message: "Order ID is Required",
                res,
                success: false
            })
        }
        try {
            const order = await this.orderService.getOrderById(orderId, userId);
            ResponseService({
                res,
                status: 200,
                message: "Order retreived successfully",
                data: order,
                success: true
            })

        } catch (error) {
            return ResponseService({
                res,
                data: null,
                message: "Failed to retrieve order",
                success: false,
                status: 404
            })
        }
    }
    // to get all orders of user/customer
    public async getUserOrders(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const orders = await this.orderService.getUserOrders(userId);
            return ResponseService({
                res,
                data: orders,
                message: "all user orders retrieved successfullly",
                success: true,
                status: 200
            })
        } catch (error) {
            return ResponseService({
                res,
                success: false,
                message: "Failed to retrieve all orders",
                status: 500,
                data: null
            })
        }
    }
    // Admin get all Orders
    public async getAllOrders(req: Request, res: Response) {
        try {
            const allOrders = await this.orderService.getAllOrders();
            return ResponseService({
                res,
                data: allOrders,
                status: 200,
                message: "All orders retrieved",
                success: true
            })
        } catch (error) {
            return ResponseService({
                res,
                data: null,
                status: 500,
                success: false
            })
        }
    }
    // cancelling order
    public async cancelOrder(req: Request, res: Response) {
        const { orderId } = req.params
        const userId = req.user?.id;
        const userRole = req.user?.role;
        if (!userId) {
            return ResponseService({
                res,
                message: "User Id is required",
                data: null,
                status: 401,
                success: false
            })
        }
        if (!orderId) {
            return ResponseService({
                res,
                message: 'Order ID required',
                data: null,
                status: 401,
                success: false
            })
        }
        try {
            const cancelOrder = await this.orderService.cancelOrder(orderId, userId, userRole);
            return ResponseService({
                res,
                data: cancelOrder,
                status: 200,
                success: true,
                message: 'Order cancelled successfully'
            })
        } catch (error: any) {
            const status = error.message.includes('not found') ? 404 :
                error.message.includes('Unauthorized') ? 403 :
                    error.message.includes('Cannot cancel') ? 400 : 500;
            return ResponseService({
                res,
                status,
                message: error.message,
                data: null,
                success: false

            })

        }
    }
    public async updateOrder(req: Request, res: Response) {
        const { orderId } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        if (!userId) {
            return ResponseService({
                res,
                data: null,
                message: "User Id is required",
                success: false,
                status: 401
            })
        }

        try {
            const updateOrder = await this.orderService.updateOrder(orderId, userId, userRole, req.body);
            return ResponseService({
                res,
                data: updateOrder,
                message: "Order updated successfully",
                success: true,
                status: 200
            })

        } catch (error: any) {
            const status = error.message.includes("not found") ? 404 :
                error.message.includes("Unauthorized") ? 403 : 500;

            return ResponseService({
                res,
                data: null,
                status,
                success: false
            })
        }
    }
}

export const orderController = new OrderController();