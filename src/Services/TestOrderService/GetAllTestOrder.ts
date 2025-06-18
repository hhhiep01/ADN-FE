import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface SampleMethod {
  id: number;
  name: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  sampleMethods: SampleMethod[];
}

export interface TestOrderItem {
  id: number;
  userId: number;
  userName: string;
  phoneNumber: string;
  email: string;
  fullName: string;
  services: Service;
  sampleMethods: SampleMethod;
  status: number;
  deliveryKitStatus: number;
  kitSendDate: string | null;
  appointmentDate: string;
  appointmentStatus: number;
  appointmentLocation: string;
  appointmentStaffId: number | null;
  appointmentStaffName: string | null;
  createdAt: string;
}

export interface GetAllTestOrderResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: {
    items: TestOrderItem[];
    total: number;
    pageIndex: number;
    pageSize: number;
  };
}

interface Signal {
  signal: AbortSignal;
}

interface FetchError extends Error {
  code?: number;
  info?: Record<string, unknown>;
}

export const getAllTestOrders = async ({
  signal,
  sampleMethodId,
  pageIndex,
  pageSize,
  testOrderStatus,
}: Signal & {
  sampleMethodId?: number | "all";
  pageIndex?: number;
  pageSize?: number;
  testOrderStatus?: number | "all";
}): Promise<GetAllTestOrderResponse> => {
  try {
    let url = apiLinks.TestOrder.getAll;
    const queryParams = [];

    if (sampleMethodId && sampleMethodId !== "all") {
      queryParams.push(`SampleMethodId=${sampleMethodId}`);
    }
    if (pageIndex !== undefined) {
      queryParams.push(`PageIndex=${pageIndex}`);
    }
    if (pageSize !== undefined) {
      queryParams.push(`PageSize=${pageSize}`);
    }
    if (testOrderStatus !== undefined && testOrderStatus !== "all") {
      queryParams.push(`TestOrderStatus=${testOrderStatus}`);
    }

    if (queryParams.length > 0) {
      url = `${url}?${queryParams.join("&")}`;
    }

    const response = await httpClient.get({
      url: url,
      signal: signal,
    });

    if (response.status !== 200) {
      const error: FetchError = new Error(
        "An error occurred while fetching Test Orders"
      );
      error.code = response.status;
      error.info = response.data as Record<string, unknown>;
      throw error;
    }

    const data: GetAllTestOrderResponse =
      response.data as GetAllTestOrderResponse;
    return data;
  } catch (error) {
    console.error("Fetching Test Orders failed", error);
    throw error;
  }
};
