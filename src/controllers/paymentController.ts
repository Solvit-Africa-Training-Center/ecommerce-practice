
import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentServices';
import { ResponseService } from '../utils/response';
import { config } from 'dotenv';
config();

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  
  async initiatePayment(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const paymentLink = await this.paymentService.initiatePayment({
        ...req.body,
        orderId: parseInt(orderId),
      });

      return ResponseService({
        res,
        success: true,
        status: 200,
        message: 'Payment initiated',
        data: { paymentLink },
      });
    } catch (error) {
      const { message, stack } = error as Error;
      const isDev = process.env.NODE_ENV === 'development';

      return ResponseService({
        res,
        success: false,
        status: 500,
        message: 'Payment initiation failed',
        data: { message, ...(isDev && { stack }) },
      });
    }
  }

  
  async handleWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['verif-hash'] as string | undefined;
      const secret = process.env.FLW_SECRET_HASH;

      if (!secret) {
        console.error('FLW_SECRET_HASH is not set');
        return ResponseService({
          res,
          success: false,
          status: 500,
          message: 'Server configuration error',
          data: {},
        });
      }

      if (!signature || signature !== secret) {
        return ResponseService({
          res,
          success: false,
          status: 401,
          message: 'Unauthorized: Invalid signature',
          data: {},
        });
      }

      await this.paymentService.handleWebhook(req.body);

      return ResponseService({
        res,
        success: true,
        status: 200,
        message: 'Webhook processed successfully',
        data: {},
      });
    } catch (error: any) {
      console.error('Webhook processing failed:', error.message);
      
      
      const status = process.env.NODE_ENV === 'production' ? 200 : 500;

      return ResponseService({
        res,
        success: false,
        status,
        message: 'Webhook processing failed',
        data: process.env.NODE_ENV === 'development' ? { error: error.message } : {},
      });
    }
  }
}