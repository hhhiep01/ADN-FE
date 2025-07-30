import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface UpdateSampleTypeRequest {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateSampleTypeResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: boolean;
}

const updateSampleType = async (id: string, request: UpdateSampleTypeRequest): Promise<UpdateSampleTypeResponse> => {
  const response = await httpClient.put({
    url: apiLinks.SampleType.update(id),
    data: request,
  });
  return response.data;
};

export const useUpdateSampleType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSampleTypeRequest }) =>
      updateSampleType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sampleTypes"],
      });
    },
  });
}; 