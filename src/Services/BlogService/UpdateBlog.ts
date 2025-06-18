import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface UpdateBlogRequest {
  id: number;
  title: string;
  image: string;
  content: string;
}

export interface UpdateBlogResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: { message: string };
}

export const updateBlog = async (
  payload: UpdateBlogRequest
): Promise<UpdateBlogResponse> => {
  try {
    const response = await httpClient.put({
      url: `${apiLinks.Blog.update}/${payload.id}`,
      data: payload,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to update blog");
    }

    return response.data as UpdateBlogResponse;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
}; 