import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface UpdateTestOrderRequest {
  id: number;
  serviceId: number;
  sampleMethodId: number;
  phoneNumber: string;
  email: string;
  fullName: string;
  appointmentDate: string;
  appointmentLocation: string;
}

export const updateTestOrder = async (
  requestBody: UpdateTestOrderRequest
): Promise<any> => {
  try {
    console.log("Updating test order with data:", requestBody);
    console.log("API URL:", apiLinks.TestOrder.update);

    const response = await httpClient.put({
      url: apiLinks.TestOrder.update,
      data: requestBody,
    });

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    if (response.status !== 200) {
      const errorData = response.data;
      console.error("Error response:", errorData);
      throw new Error(errorData.errorMessage || "Failed to update test order");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating test order:", error);
    throw error;
  }
};
