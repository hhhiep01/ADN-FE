import { useQuery } from "@tanstack/react-query";
import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";
import type { SampleType } from "./GetAllSampleTypes";

export interface GetSampleTypeByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: SampleType;
}

const getSampleTypeById = async (id: string): Promise<GetSampleTypeByIdResponse> => {
  const response = await httpClient.get({
    url: apiLinks.SampleType.getById(id),
  });
  return response.data;
};

export const useGetSampleTypeById = (id: string) => {
  return useQuery({
    queryKey: ["sampleType", id],
    queryFn: () => getSampleTypeById(id),
    enabled: !!id,
  });
}; 