import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface SampleMethod {
  id: number;
  name: string;
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  sampleMethodIds: number[];
  image: string;
}

export const createService = async (request: CreateServiceRequest): Promise<void> => {
  const response = await httpClient.post({
    url: apiLinks.Service.create,
    data: request
  });
  return response.data;
}; 