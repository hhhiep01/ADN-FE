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

export interface GetLocusResultBySampleIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: LocusResultItem[];
}

export interface GetLocusResultBySampleIdRequest {
  signal?: AbortSignal;
  sampleId: number;
}

export const getLocusResultBySampleId = async ({
  signal,
  sampleId,
}: GetLocusResultBySampleIdRequest): Promise<GetLocusResultBySampleIdResponse> => {
  try {
    const response = await httpClient.get({
      url: apiLinks.LocusResult.getBySampleId(sampleId.toString()),
      signal,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to fetch locus results by sample");
    }

    return response.data as GetLocusResultBySampleIdResponse;
  } catch (error) {
    console.error("Error fetching locus results by sample:", error);
    throw error;
  }
}; 