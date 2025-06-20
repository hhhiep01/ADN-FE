import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface GetBlogResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: {
    id: number;
    title: string;
    image: string;
    content: string;
    userAccountId: number;
    authorName: string;
    createdDate: string;
    modifiedDate: string | null;
  };
}

export const getBlog = async (id: number): Promise<GetBlogResponse> => {
  try {
    const response = await httpClient.get({
      url: apiLinks.Blog.getById(id.toString()),
    });
    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to get blog");
    }
    return response.data as GetBlogResponse;
  } catch (error) {
    console.error("Error getting blog:", error);
    throw error;
  }
};
