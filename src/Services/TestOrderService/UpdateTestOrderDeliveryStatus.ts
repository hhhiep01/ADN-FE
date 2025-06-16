import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface UpdateTestOrderDeliveryStatusRequest {
  id: number;
  deliveryKitStatus: number;
}

export const updateTestOrderDeliveryStatus = async (
  requestBody: UpdateTestOrderDeliveryStatusRequest
): Promise<any> => {
  try {
    const response = await httpClient.put({
      url: apiLinks.TestOrder.updateDeliveryKitStatus,
      data: requestBody,
    });
    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(
        errorData.errorMessage || "Failed to update test order delivery status"
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error updating test order delivery status:", error);
    throw error;
  }
};
