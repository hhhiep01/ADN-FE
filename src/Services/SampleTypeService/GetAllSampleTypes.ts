import { useQuery } from "@tanstack/react-query";
import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface SampleType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllSampleTypesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: SampleType[];
}

const getAllSampleTypes = async (): Promise<GetAllSampleTypesResponse> => {
  const response = await httpClient.get({
    url: apiLinks.SampleType.getAll,
  });
  return response.data;
};

export const useGetAllSampleTypes = () => {
  return useQuery({
    queryKey: ["sampleTypes"],
    queryFn: getAllSampleTypes,
  });
}; 