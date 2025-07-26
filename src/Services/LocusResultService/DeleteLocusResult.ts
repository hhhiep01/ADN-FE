import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface DeleteLocusResultResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: boolean;
}

export const deleteLocusResult = async (id: number): Promise<DeleteLocusResultResponse> => {
  try {
    const response = await httpClient.delete({
      url: apiLinks.LocusResult.delete(id.toString()),
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to delete locus result");
    }

    return response.data as DeleteLocusResultResponse;
  } catch (error) {
    console.error("Error deleting locus result:", error);
    throw error;
  }
}; 