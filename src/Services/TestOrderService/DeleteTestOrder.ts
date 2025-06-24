import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface DeleteTestOrderResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: { message: string };
}

const deleteTestOrder = async (id: number): Promise<DeleteTestOrderResponse> => {
  try {
    const response = await httpClient.delete({
      url: apiLinks.TestOrder.delete(id.toString()),
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(
        errorData.errorMessage || errorData.result || "Failed to delete test order"
      );
    }

    return response.data as DeleteTestOrderResponse;
  } catch (error) {
    console.error("Error deleting test order:", error);
    throw error;
  }
};

export const useDeleteTestOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTestOrder,
    onSuccess: () => {
      // Invalidate and refetch test orders after successful deletion
      queryClient.invalidateQueries({
        queryKey: ["testOrders"],
      });
    },
  });
}; 