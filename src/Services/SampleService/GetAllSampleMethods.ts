import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface SampleMethodItem {
  id: number;
  name: string;
}

export interface GetAllSampleMethodsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: SampleMethodItem[];
}

export const getAllSampleMethods = async (
  signal?: AbortSignal
): Promise<GetAllSampleMethodsResponse> => {
  try {
    const response = await httpClient.get({
      url: apiLinks.SampleMethod.getAll,
      signal,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to fetch sample methods");
    }

    return response.data as GetAllSampleMethodsResponse;
  } catch (error) {
    console.error("Error fetching sample methods:", error);
    throw error;
  }
}; 