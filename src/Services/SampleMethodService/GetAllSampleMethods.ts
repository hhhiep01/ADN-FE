import { useQuery } from "@tanstack/react-query";
import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

// Interface cho một phương thức thu mẫu
export interface SampleMethod {
  id: number;
  name: string;
}

// Interface cho toàn bộ response từ API
export interface GetAllSampleMethodsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: SampleMethod[];
}

// Hàm gọi API để lấy tất cả các phương thức thu mẫu
const getAllSampleMethods = async (): Promise<GetAllSampleMethodsResponse> => {
  const response = await httpClient.get({
    url: apiLinks.SampleMethod.getAll,
  });
  return response.data;
};

// Custom hook để sử dụng trong component
export const useGetAllSampleMethods = () => {
  return useQuery<GetAllSampleMethodsResponse, Error>({
    queryKey: ["sampleMethods"],
    queryFn: getAllSampleMethods,
  });
}; 