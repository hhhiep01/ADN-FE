import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface Participant {
  collectionDate: string;
  sampleStatus: number;
  notes: string;
  participantName: string;
  relationship: string;
}

export interface CreateSampleRequest {
  testOrderId: number;
  participants: Participant[];
}

export const createSample = async (
  requestBody: CreateSampleRequest
): Promise<any> => {
  try {
    console.log("Creating sample with data:", requestBody);
    console.log("API URL:", apiLinks.Sample.create);

    const response = await httpClient.post({
      url: apiLinks.Sample.create,
      data: requestBody,
    });

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    if (response.status !== 200 && response.status !== 201) {
      const errorData = response.data;
      console.error("Error response:", errorData);
      throw new Error(errorData.errorMessage || "Failed to create sample");
    }
    return response.data;
  } catch (error) {
    console.error("Error creating sample:", error);
    throw error;
  }
};
