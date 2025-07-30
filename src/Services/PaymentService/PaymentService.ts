import httpClient from "../../httpClient/httpClient";
import { apiLinks } from "../MainService";

// Interfaces for payment requests and responses
interface CreatePaymentRequest {
  testOrderId: number;
}

interface PaymentResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: string; // VNPay payment URL
}

interface PaymentCallbackResponse {
  paymentId: string;
  status: string;
  transactionId?: string;
  message: string;
}

// Create payment
export const createPayment = async (data: CreatePaymentRequest) => {
  try {
    const response = await httpClient.post({
      url: apiLinks.Payment.create,
      data: data,
    });
    
    return response.data as PaymentResponse;
  } catch (error: unknown) {
    throw error;
  }
};

// Get payment callback
export const getPaymentCallback = async (paymentId: string) => {
  try {
    const response = await httpClient.get({
      url: `${apiLinks.Payment.callback}?paymentId=${paymentId}`,
    });
    
    return response.data as PaymentCallbackResponse;
  } catch (error: unknown) {
    throw error;
  }
};

// Get payment status
export const getPaymentStatus = async (paymentId: string) => {
  try {
    const response = await httpClient.get({
      url: `${apiLinks.Payment.create}/${paymentId}`,
    });
    
    return response.data as PaymentResponse;
  } catch (error: unknown) {
    throw error;
  }
}; 