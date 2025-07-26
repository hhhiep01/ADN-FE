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
    const response = await httpClient.get({
      url: `${apiLinks.Sample.getByTestOrderId(testOrderId.toString())}`,
      signal,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to fetch sample by test order");
    }

    return response.data as GetSampleByTestOrderResponse;
  } catch (error) {
    console.error("Error fetching sample by test order:", error);
    throw error;
  }
}; 