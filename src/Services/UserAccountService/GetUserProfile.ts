import { useQuery } from "@tanstack/react-query";
import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

// Interface cho thông tin hồ sơ người dùng
export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  imgUrl: string | null;
}

// Interface cho toàn bộ response từ API
export interface GetUserProfileResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: UserProfile;
}

// Hàm gọi API để lấy hồ sơ người dùng
const getUserProfile = async (): Promise<GetUserProfileResponse> => {
  const response = await httpClient.get({
    url: apiLinks.UserAccount.getUserProfile,
  });
  return response.data;
};

// Custom hook để sử dụng trong component
export const useGetUserProfile = () => {
  return useQuery<GetUserProfileResponse, Error>({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });
}; 