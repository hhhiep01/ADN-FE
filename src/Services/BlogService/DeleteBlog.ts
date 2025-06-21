import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface DeleteBlogResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: { message: string };
}

export const deleteBlog = async (
  id: string
): Promise<DeleteBlogResponse> => {
  try {
    const response = await httpClient.delete({
      url: apiLinks.Blog.delete(id),
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to delete blog");
    }

    return response.data as DeleteBlogResponse;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
}; 