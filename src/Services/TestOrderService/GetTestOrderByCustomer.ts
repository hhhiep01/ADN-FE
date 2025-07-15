import { useQuery } from "@tanstack/react-query";
import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  sampleMethods: SampleMethod[];
  image: string;
}

export interface SampleMethod {
  id: number;
  name: string;
}

export interface Result {
  id: number;
  sampleId: number;
  resultDate: string;
  conclusion: string;
  filePath: string;
  serviceName: string;
  sampleMethodName: string;
}

export interface TestOrderShort {
  id: number;
  serviceName: string;
}

export interface Sample {
  id: number;
  collectionDate: string;
  sampleStatus: number;
  notes: string;
  collectedBy: number;
  collectorName: string | null;
  testOrder: TestOrderShort;
  result: Result | null;
}

export interface TestOrderCustomer {
  id: number;
  userId: number;
  userName: string | null;
  phoneNumber: string;
  email: string;
  fullName: string;
  services: Service;
  sampleMethods: SampleMethod;
  status: number;
  deliveryKitStatus: number;
  kitSendDate: string;
  appointmentDate: string;
  appointmentLocation: string;
  appointmentStaffId: number | null;
  appointmentStaffName: string | null;
  samples: Sample[];
}

export interface GetTestOrderByCustomerResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: TestOrderCustomer[];
}

export const getTestOrderByCustomer =
  async (): Promise<GetTestOrderByCustomerResponse> => {
    const response = await httpClient.get({
      url: apiLinks.TestOrder.getByCustomer,
    });
    return response.data;
  };

export const useGetTestOrderByCustomer = () => {
  return useQuery<GetTestOrderByCustomerResponse, Error>({
    queryKey: ["testOrderByCustomer"],
    queryFn: getTestOrderByCustomer,
  });
};
