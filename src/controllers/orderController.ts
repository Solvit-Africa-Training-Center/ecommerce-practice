import {Request, Response } from "express";
import { ResponseService } from "../utils/response";
import { GetAllOrders, OrderInterface } from "../types/orderInterface";
import { Database } from "../database";

interface IRequestOrderData extends Request {
  body: OrderInterface;
}

// export const makeOrder=async (req: IRequestOrderData, res: Response) => {
//     try{
//         const { userId, orderStatus, paymentStatus, totalAmount, shippingAddress, items } = req.body;
// }