import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface DeleteSampleTypeResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: boolean;
}

const deleteSampleType = async (id: string): Promise<DeleteSampleTypeResponse> => {
  const response = await httpClient.delete({
    url: apiLinks.SampleType.delete(id),
  });
  return response.data;
};

export const useDeleteSampleType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSampleType,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sampleTypes"],
      });
    },
  });
}; 