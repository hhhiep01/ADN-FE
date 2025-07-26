import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface LocusResultItem {
  id: number;
  sampleId: number;
  locusName: string;
  allele1: string;
  allele2: string;
  result: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllLocusResultsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: LocusResultItem[];
}

export interface GetAllLocusResultsRequest {
  signal?: AbortSignal;
}

export const getAllLocusResults = async ({
  signal,
}: GetAllLocusResultsRequest): Promise<GetAllLocusResultsResponse> => {
  try {
    const response = await httpClient.get({
      url: apiLinks.LocusResult.getAll,
      signal,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to fetch locus results");
    }

    return response.data as GetAllLocusResultsResponse;
  } catch (error) {
    console.error("Error fetching locus results:", error);
    throw error;
  }
}; 