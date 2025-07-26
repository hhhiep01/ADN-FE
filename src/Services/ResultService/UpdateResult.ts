import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface UpdateResultRequest {
  id: number;
  testOrderId: number;
  resultDate: string;
  conclusion: string;
  filePath: string;
}

export interface UpdateResultResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: any;
}

export const updateResult = async (
  payload: UpdateResultRequest
): Promise<UpdateResultResponse> => {
  try {
    const response = await httpClient.put({
      url: apiLinks.Result.update(payload.id.toString()),
      data: payload,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(
        errorData.errorMessage || errorData.result || "Failed to update result"
      );
    }

    return response.data as UpdateResultResponse;
  } catch (error) {
    console.error("Error updating result:", error);
    throw error;
  }
};
