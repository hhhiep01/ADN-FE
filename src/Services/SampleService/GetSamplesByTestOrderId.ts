import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface Sample {
  id: number;
  testOrderId: number;
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: number;
  sampleId: number;
  collectionDate: string;
  sampleStatus: number;
  notes: string;
  participantName: string;
  relationship: string;
  sampleTypeId: number;
  fingerprintImagePath: string;
}

export interface GetSamplesByTestOrderIdResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: Sample[];
}

const getSamplesByTestOrderId = async (testOrderId: string): Promise<GetSamplesByTestOrderIdResponse> => {
  const response = await httpClient.get({
    url: apiLinks.Sample.getByTestOrderId(testOrderId),
  });
  return response.data;
};

export { getSamplesByTestOrderId }; 