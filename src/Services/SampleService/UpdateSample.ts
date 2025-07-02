import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface UpdateSampleRequest {
  id: number;
  testOrderId: number;
  collectionDate: string;
  receivedDate: string;
  sampleStatus: number;
  notes: string;
}

export const updateSample = async (
  requestBody: UpdateSampleRequest
): Promise<any> => {
  try {
    console.log("Updating sample with data:", requestBody);
    console.log("API URL:", apiLinks.Sample.update);

    const response = await httpClient.put({
      url: apiLinks.Sample.update,
      data: requestBody,
    });

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    if (response.status !== 200) {
      const errorData = response.data;
      console.error("Error response:", errorData);
      throw new Error(errorData.errorMessage || "Failed to update sample");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating sample:", error);
    throw error;
  }
};
