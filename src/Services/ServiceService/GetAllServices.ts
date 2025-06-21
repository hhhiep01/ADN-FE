import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface SampleMethod {
  id: number;
  name: string;
}

export interface ServiceItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  sampleMethods: SampleMethod[];
}

export interface GetAllServicesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: ServiceItem[];
}

export interface GetAllServicesRequest {
  signal?: AbortSignal;
  pageIndex?: number;
  pageSize?: number;
  serviceId?: string;
}

export const getAllServices = async ({
  signal,
  pageIndex,
  pageSize,
  serviceId,
}: GetAllServicesRequest): Promise<GetAllServicesResponse> => {
  try {
    const params = new URLSearchParams({});

    if (pageIndex !== undefined) {
      params.append("pageIndex", pageIndex.toString());
    }
    if (pageSize !== undefined) {
      params.append("pageSize", pageSize.toString());
    }
    if (serviceId !== undefined) {
      params.append("serviceId", serviceId);
    }

    const response = await httpClient.get({
      url: `${apiLinks.Service.getAll}?${params.toString()}`,
      signal,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to fetch services");
    }

    return response.data as GetAllServicesResponse;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}; 