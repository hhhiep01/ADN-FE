import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface DeleteResultResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: { message: string };
}

export const deleteResult = async (
  id: string
): Promise<DeleteResultResponse> => {
  try {
    const response = await httpClient.delete({
      url: apiLinks.Result.delete(id),
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to delete result");
    }

    return response.data as DeleteResultResponse;
  } catch (error) {
    console.error("Error deleting result:", error);
    throw error;
  }
};
