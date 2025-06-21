import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface TestOrder {
  id: string;
  // Các trường khác của TestOrder...
}

export interface CreateTestOrderRequest {
  serviceId: number;
  sampleMethodId: number;
  phoneNumber: string;
  email: string;
  fullName: string;
  appointmentDate?: string;
  appointmentLocation?: string;
}

export interface CreateTestOrderResponse {
    message: string;
    data: TestOrder;
}

const createTestOrder = async (request: CreateTestOrderRequest): Promise<CreateTestOrderResponse> => {
    const response = await httpClient.post({
        url: apiLinks.TestOrder.create,
        data: request,
    });
    return response.data;
}

export const useCreateTestOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTestOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["testOrders"],
            });
        }
    });
} 