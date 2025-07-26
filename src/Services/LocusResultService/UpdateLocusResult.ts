import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface LocusAllele {
  locusName: string;
  firstAllele: string;
  secondAllele: string;
}

export interface UpdateLocusResultRequest {
  sampleId: number;
  locusAlleles: LocusAllele[];
}

export interface UpdateLocusResultResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: {
    id: number;
    sampleId: number;
    locusName: string;
    firstAllele: string;
    secondAllele: string;
  }[];
}

export const updateLocusResult = async (
  sampleId: number,
  data: UpdateLocusResultRequest
): Promise<UpdateLocusResultResponse> => {
  try {
    const response = await httpClient.put({
      url: apiLinks.LocusResult.update(sampleId.toString()),
      data,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to update locus result");
    }

    return response.data as UpdateLocusResultResponse;
  } catch (error) {
    console.error("Error updating locus result:", error);
    throw error;
  }
}; 