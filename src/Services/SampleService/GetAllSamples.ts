import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface TestOrderNested {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  serviceName: string;
}

export interface SampleResultNested {
  id: number;
  sampleId: number;
  resultDate: string;
  conclusion: string;
  filePath: string;
}

export interface SampleMethodNested {
  id: number;
  name: string;
}

export interface SampleItem {
  id: number;
  collectionDate: string;
  receivedDate: string;
  sampleStatus: number;
  notes: string;
  collectedBy: number;
  collectorName: string;
  testOrder: TestOrderNested;
  result?: SampleResultNested;
  sampleMethod?: SampleMethodNested;
  shippingProvider?: string;
  trackingNumber?: string;
}

export interface GetAllSamplesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: SampleItem[];
}

export interface GetAllSamplesRequest {
  signal?: AbortSignal;
  pageIndex?: number;
  pageSize?: number;
  sampleStatus?: number | "all";
}

export const getAllSamples = async ({
  signal,
  pageIndex,
  pageSize,
  sampleStatus,
}: GetAllSamplesRequest): Promise<GetAllSamplesResponse> => {
  try {
    const params = new URLSearchParams({});

    if (pageIndex !== undefined) {
      params.append("pageIndex", pageIndex.toString());
    }
    if (pageSize !== undefined) {
      params.append("pageSize", pageSize.toString());
    }

    if (sampleStatus !== "all" && sampleStatus !== undefined) {
      params.append("sampleStatus", sampleStatus.toString());
    }

    const response = await httpClient.get({
      url: `${apiLinks.Sample.getAll}?${params.toString()}`,
      signal,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to fetch samples");
    }

    return response.data as GetAllSamplesResponse;
  } catch (error) {
    console.error("Error fetching samples:", error);
    throw error;
  }
};
