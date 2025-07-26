import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface SampleMethod {
  id: number;
  name: string;
}

export interface GetTestOrderByIdResult {
  id: number;
  userId: number;
  username: string;
  phoneNumber: string;
  email: string;
  fullName: string;
  serviceId: number;
  serviceName: string;
  serviceDescription: string;
  note: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  sampleMethods: SampleMethod[];
}

export interface GetTestOrderByIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: GetTestOrderByIdResult;
}

export const getTestOrderById = async (id: number): Promise<GetTestOrderByIdResponse> => {
  const response = await httpClient.get({
    url: apiLinks.TestOrder.getById(id.toString()),
  });
  if (response.status !== 200) {
    throw new Error(response.data?.errorMessage || "Failed to fetch test order by id");
  }
  return response.data as GetTestOrderByIdResponse;
}; 