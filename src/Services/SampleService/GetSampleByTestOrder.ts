import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface TestOrderNested {
  id: number;
  serviceName: string;
}

export interface SampleResultNested {
  id: number;
  sampleId: number;
  resultDate: string;
  conclusion: string;
  filePath: string;
}

export interface SampleTypeNested {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface LocusResultNested {
  id: number;
  sampleId: number;
  locusName: string;
  firstAllele: string;
  secondAllele: string;
}

export interface SampleByTestOrderItem {
  id: number;
  collectionDate: string;
  sampleStatus: number;
  notes: string;
  collectedBy: number;
  collectorName: string;
  testOrder: TestOrderNested;
  result: SampleResultNested | null;
  shippingProvider: string | null;
  trackingNumber: string | null;
  participantName: string;
  relationship: string;
  sampleCode: string;
  locusResults: LocusResultNested[];
  sampleType: SampleTypeNested;
  fingerprintImagePath: string;
}

export interface GetSampleByTestOrderResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: SampleByTestOrderItem[];
}

export interface GetSampleByTestOrderRequest {
  signal?: AbortSignal;
  testOrderId: number;
}

export const getSampleByTestOrder = async ({
  signal,
  testOrderId,
}: GetSampleByTestOrderRequest): Promise<GetSampleByTestOrderResponse> => {
  try {
    console.log("Making request to:", `${apiLinks.Sample.getByTestOrderId(testOrderId.toString())}`);
    
    const response = await httpClient.get({
      url: `${apiLinks.Sample.getByTestOrderId(testOrderId.toString())}`,
      signal,
    });

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || `HTTP ${response.status}: Failed to fetch sample by test order`);
    }

    // Kiểm tra response data có đúng format không
    if (!response.data || typeof response.data !== 'object') {
      throw new Error("Invalid response format from server");
    }

    return response.data as GetSampleByTestOrderResponse;
  } catch (error: any) {
    console.error("Error fetching sample by test order:", error);
    
    // Cải thiện error message
    if (error.name === 'AbortError') {
      throw new Error("Request was cancelled");
    }
    
    if (error.message) {
      throw new Error(error.message);
    }
    
    throw new Error("Network error: Unable to connect to server");
  }
}; 