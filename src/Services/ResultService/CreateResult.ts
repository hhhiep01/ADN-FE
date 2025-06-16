import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface CreateResultRequest {
  sampleId: number;
  resultDate: string;
  conclusion: string;
  filePath: string;
}

export interface CreateResultResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: { id: number; message: string };
}

export const createResult = async (
  payload: CreateResultRequest
): Promise<CreateResultResponse> => {
  try {
    const response = await httpClient.post({
      url: apiLinks.Result.create,
      data: payload,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to create result");
    }

    return response.data as CreateResultResponse;
  } catch (error) {
    console.error("Error creating result:", error);
    throw error;
  }
};
