import { makeOrder } from "../services/OrderServices";
import { Request, Response } from "express";
import { ResponseService } from "../utils/response";

export class OrderController {
    public async createOrder(req: Request, res: Response) {
      const id=req.body.id as string;
        if (!id) {
            return ResponseService({
                res,
                status: 400,
                message: "User ID is required",
                data: null,
                success: false
            });
        }
        try {
        const newOrder= await makeOrder(req as any, res);
        return ResponseService({
            res,
            status: 201,
            message: "Order created successfully",
            data: newOrder,
            success: true,
        })
        } catch (err) {
            const { message, stack } = err as Error;
            return ResponseService({
                res,
                status: 500,
                message: message,
                data: stack,
                success: false,
            })
        }
    }

}
export const orderController = new OrderController();