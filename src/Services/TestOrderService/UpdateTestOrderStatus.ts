import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface UpdateTestOrderStatusRequest {
  id: number;
  testOrderStatus: number;
}

export const updateTestOrderStatus = async (
  requestBody: UpdateTestOrderStatusRequest
): Promise<any> => {
  try {
    console.log("Updating test order status with data:", requestBody);
    console.log("API URL:", apiLinks.TestOrder.updateStatus);

    const response = await httpClient.put({
      url: apiLinks.TestOrder.updateStatus,
      data: requestBody,
    });

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    if (response.status !== 200) {
      const errorData = response.data;
      console.error("Error response:", errorData);
      throw new Error(
        errorData.errorMessage || "Failed to update test order status"
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error updating test order status:", error);
    throw error;
  }
};
