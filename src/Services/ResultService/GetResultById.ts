import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";
import type { ResultItem } from "./GetAllResults";

export interface GetResultByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: ResultItem;
}

export const getResultById = async (
  id: string,
  signal?: AbortSignal
): Promise<GetResultByIdResponse> => {
  try {
    const response = await httpClient.get({
      url: apiLinks.Result.getById(id),
      signal,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to fetch result by ID");
    }

    return response.data as GetResultByIdResponse;
  } catch (error) {
    console.error("Error fetching result by ID:", error);
    throw error;
  }
};
