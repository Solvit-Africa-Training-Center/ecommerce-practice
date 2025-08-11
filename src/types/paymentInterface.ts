// src/interfaces/payment.interface.ts

export interface IPaymentInitiation {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;  
  paymentMethod: 'card' | 'mobilemoney' | 'airtelmoney' | 'banktransfer';
  redirectUrl: string;
}

export interface IFlutterwaveResponse {
  status: string;
  message: string;
  data?: {
    link?: string;
    id?: number;
    tx_ref?: string;
    amount?: number;
    currency?: string;
  };
}

export interface IWebhookEvent {
  event: string;
  data: {
    id: number;
    tx_ref: string;
    status: string;
    amount: number;
    currency: string;
    payment_type: string;
    customer: {
      email: string;
      phone: string;
      name: string;
    };
    created_at?: string;
    fraud_status?: string;
    amount_settled?: number;
  };
}