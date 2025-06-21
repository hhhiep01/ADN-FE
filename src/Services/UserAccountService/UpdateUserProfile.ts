import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";
import type { UserProfile } from "./GetUserProfile"; // Tái sử dụng interface UserProfile

// Interface cho request body khi cập nhật hồ sơ
export interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  imgUrl: string;
}

// Interface cho response trả về từ API
export interface UpdateUserProfileResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: UserProfile; // Giả định API trả về thông tin user đã được cập nhật
}

// Hàm gọi API để cập nhật hồ sơ
const updateUserProfile = async (
  request: UpdateUserProfileRequest
): Promise<UpdateUserProfileResponse> => {
  const response = await httpClient.put({
    url: apiLinks.UserAccount.updateUserProfile,
    data: request,
  });
  return response.data;
};

// Custom hook để sử dụng trong component
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserProfileResponse,
    Error,
    UpdateUserProfileRequest
  >({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      // Cập nhật lại cache của userProfile sau khi update thành công
      queryClient.setQueryData(["userProfile"], {
        statusCode: data.statusCode,
        isSuccess: data.isSuccess,
        errorMessage: data.errorMessage,
        result: data.result,
      });
    },
  });
}; 