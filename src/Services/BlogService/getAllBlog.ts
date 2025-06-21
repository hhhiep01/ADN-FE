import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface BlogItem {
  id: number;
  title: string;
  image: string;
  content: string;
  userAccountId: number;
  authorName: string;
  createdDate: string;
  modifiedDate: string | null;
}

export interface GetAllBlogResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: BlogItem[];
}

export interface GetAllBlogRequest {
  signal?: AbortSignal;
  pageIndex?: number;
  pageSize?: number;
}

export const getAllBlog = async ({
  signal,
  pageIndex,
  pageSize,
}: GetAllBlogRequest = {}): Promise<GetAllBlogResponse> => {
  try {
    const params = new URLSearchParams({});
    if (pageIndex !== undefined) {
      params.append("pageIndex", pageIndex.toString());
    }
    if (pageSize !== undefined) {
      params.append("pageSize", pageSize.toString());
    }
    const response = await httpClient.get({
      url: `${apiLinks.Blog.getAll}?${params.toString()}`,
      signal,
    });
    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to fetch blogs");
    }
    return response.data as GetAllBlogResponse;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
}; 