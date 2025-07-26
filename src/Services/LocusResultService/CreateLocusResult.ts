import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface LocusAllele {
  locusName: string;
  firstAllele: string;
  secondAllele: string;
}

export interface CreateLocusResultRequest {
  sampleId: number;
  locusAlleles: LocusAllele[];
}

export interface CreateLocusResultResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: {
    id: number;
    sampleId: number;
    locusName: string;
    firstAllele: string;
    secondAllele: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export const createLocusResult = async (
  data: CreateLocusResultRequest
): Promise<CreateLocusResultResponse> => {
  try {
    const response = await httpClient.post({
      url: apiLinks.LocusResult.create,
      data,
    });

    if (response.status !== 200 && response.status !== 201) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to create locus result");
    }

    return response.data as CreateLocusResultResponse;
  } catch (error) {
    console.error("Error creating locus result:", error);
    throw error;
  }
}; 