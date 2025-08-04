import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";
import type { GetAllPaymentHistoryResponse } from "./PaymentInterface";

export const getAllPaymentHistory = async (): Promise<GetAllPaymentHistoryResponse> => {
  try {
    const response = await httpClient.get({
      url: apiLinks.Payment.getAll,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(
        errorData.errorMessage || errorData.result || "Failed to get payment history"
      );
    }

    return response.data as GetAllPaymentHistoryResponse;
  } catch (error) {
    console.error("Error getting payment history:", error);
    throw error;
  }
}; 