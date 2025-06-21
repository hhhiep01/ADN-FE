import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface ResultItem {
  id: number;
  sampleId: number;
  resultDate: string;
  conclusion: string;
  filePath: string;
  serviceName: string;
  sampleMethodName: string;
}

export interface GetAllResultsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: ResultItem[];
}

export interface GetAllResultsRequest {
  signal?: AbortSignal;
  pageIndex?: number;
  pageSize?: number;
  resultId?: string;
}

export const getAllResults = async ({
  signal,
  pageIndex,
  pageSize,
  resultId,
}: GetAllResultsRequest): Promise<GetAllResultsResponse> => {
  try {
    const params = new URLSearchParams({});

    if (pageIndex !== undefined) {
      params.append("pageIndex", pageIndex.toString());
    }
    if (pageSize !== undefined) {
      params.append("pageSize", pageSize.toString());
    }
    if (resultId !== undefined) {
      params.append("resultId", resultId);
    }

    const response = await httpClient.get({
      url: `${apiLinks.Result.getAll}?${params.toString()}`,
      signal,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to fetch results");
    }

    return response.data as GetAllResultsResponse;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};
