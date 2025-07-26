import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface LocusResultItem {
  id: number;
  sampleId: number;
  locusName: string;
  firstAllele: string;
  secondAllele: string;
}

export interface GetLocusResultByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: LocusResultItem[];
}

export interface GetLocusResultByIdRequest {
  signal?: AbortSignal;
  id: number;
}

export const getLocusResultById = async ({
  signal,
  id,
}: GetLocusResultByIdRequest): Promise<GetLocusResultByIdResponse> => {
  try {
    const response = await httpClient.get({
      url: apiLinks.LocusResult.getById(id.toString()),
      signal,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to fetch locus result");
    }

    return response.data as GetLocusResultByIdResponse;
  } catch (error) {
    console.error("Error fetching locus result:", error);
    throw error;
  }
}; 