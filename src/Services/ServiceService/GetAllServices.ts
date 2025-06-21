import { useQuery } from "@tanstack/react-query";
import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

// Interface cho một phương thức thu mẫu (tóm tắt)
export interface SampleMethodSummary {
  id: number;
  name: string;
}

// Interface cho một dịch vụ
export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  sampleMethods: SampleMethodSummary[];
  image: string;
}

// Interface cho toàn bộ response từ API
export interface GetAllServicesResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: Service[];
}

// Hàm gọi API để lấy tất cả các dịch vụ
const getAllServices = async (): Promise<GetAllServicesResponse> => {
  const response = await httpClient.get({
    url: apiLinks.Service.getAll,
  });
  return response.data;
};

// Custom hook để sử dụng trong component
export const useGetAllServices = () => {
  return useQuery<GetAllServicesResponse, Error>({
    queryKey: ["services"],
    queryFn: getAllServices,
  });
}; 