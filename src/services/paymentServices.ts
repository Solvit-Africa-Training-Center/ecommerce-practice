

import axios from 'axios';
import { IPaymentInitiation } from '../types/paymentInterface';
import { Payment } from '../database/models/paymentModel';
//import { Order } from '../database/models/orderModel'; 
import { config } from 'dotenv';
config();

export class PaymentService {
  private readonly flutterwaveBaseUrl = 'https://api.flutterwave.com/v3'; 
  private readonly secretKey = process.env.FLUTTERWAVE_SECRET_KEY!;

  async initiatePayment(paymentData: IPaymentInitiation): Promise<string> {
    try {
      const txRef = this.generateTxRef();

      // Fetch order to get customerId
      // //const order = await Order.findByPk(paymentData.orderId);
      // if (!order) throw new Error('Order not found');
      // const customerId = order.userId;

      
      const response = await axios.post(
        `${this.flutterwaveBaseUrl}/payments`,
        {
          tx_ref: txRef,
          amount: paymentData.amount,
          currency: paymentData.currency,
          redirect_url: paymentData.redirectUrl, 
          customer: {
            email: paymentData.customerEmail,
            name: paymentData.customerName,
          },
          meta: { order_id: paymentData.orderId },
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );

      const paymentLink = response.data.data?.link;
      if (!paymentLink) {
        throw new Error('No payment link returned from Flutterwave');
      }

      
      await Payment.create({
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        method: paymentData.paymentMethod,
        txRef,
        status: 'pending',
        
        
      });

      return paymentLink;
    } catch (error: any) {
      throw new Error(`Payment initiation failed: ${error.message}`);
    }
  }

  async handleWebhook(event: any): Promise<void> {
    if (event.event !== 'charge.completed') return;

    const txRef = event.data.tx_ref;
    const payment = await Payment.findOne({ where: { txRef } });

    
    if (!payment || payment.status !== 'pending') return;

    //  Validate status
    if (event.data.status !== 'successful') {
      await payment.update({
        status: 'failed',
        flwTransactionId: String(event.data.id),
        rawEvent: JSON.stringify(event),
      });
      return;
    }

    // ✅ Update payment
    await payment.update({
      status: 'successful',
      flwTransactionId: String(event.data.id),
      method: event.data.payment_type, // Use actual method from Flutterwave
      rawEvent: JSON.stringify(event),
    });

    
  }

  private generateTxRef(): string {
    return `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
}