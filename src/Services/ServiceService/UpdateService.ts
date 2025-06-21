import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface SampleMethod {
  id: number;
  name: string;
}

export interface UpdateServiceRequest {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  sampleMethodIds: number[];
}

export const updateService = async (request: UpdateServiceRequest): Promise<void> => {
  const { id, ...data } = request;
  const response = await httpClient.put({
    url: apiLinks.Service.update,
    data: { id, ...data },
  });
  return response.data;
}; 