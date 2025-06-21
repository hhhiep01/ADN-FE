import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface UserHistoryResultItem {
  id: number;
  sampleId: number;
  resultDate: string;
  conclusion: string;
  filePath: string;
  serviceName: string;
  sampleMethodName: string;
}

export interface GetUserHistoryResultResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: UserHistoryResultItem[];
}

export const getUserHistoryResult = async (
  signal?: AbortSignal
): Promise<GetUserHistoryResultResponse> => {
  try {
    const response = await httpClient.get({
      url: apiLinks.Result.userHistory,
      signal,
    });
    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(
        errorData.errorMessage ||
          errorData.result ||
          "Failed to fetch user history result"
      );
    }
    return response.data as GetUserHistoryResultResponse;
  } catch (error) {
    console.error("Error fetching user history result:", error);
    throw error;
  }
};
