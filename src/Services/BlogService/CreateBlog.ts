import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface CreateBlogRequest {
  id: number;
  title: string;
  image: string;
  content: string;
}

export interface CreateBlogResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: { id: number; message: string };
}

export const createBlog = async (
  payload: CreateBlogRequest
): Promise<CreateBlogResponse> => {
  try {
    const response = await httpClient.post({
      url: apiLinks.Blog.create,
      data: payload,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to create blog");
    }

    return response.data as CreateBlogResponse;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
}; 