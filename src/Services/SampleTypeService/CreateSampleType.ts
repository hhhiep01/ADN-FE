import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface CreateSampleTypeRequest {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateSampleTypeResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: number; // The created sample type ID
}

const createSampleType = async (request: CreateSampleTypeRequest): Promise<CreateSampleTypeResponse> => {
  const response = await httpClient.post({
    url: apiLinks.SampleType.create,
    data: request,
  });
  return response.data;
};

export const useCreateSampleType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSampleType,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sampleTypes"],
      });
    },
  });
}; 