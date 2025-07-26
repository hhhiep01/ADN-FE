import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface UploadFileResponse {
  fileName: string;
  path: string;
}

export const uploadFile = async (file: File): Promise<UploadFileResponse> => {
  try {
    console.log("UploadFile.ts - Starting upload...");
    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size
    });
    console.log("API URL:", apiLinks.Files.upload);

    const formData = new FormData();
    formData.append("file", file);

    console.log("FormData created, calling httpClient.post...");
    const response = await httpClient.post({
      url: apiLinks.Files.upload,
      data: formData,
    }, true); // Thêm tham số isMultipart = true

    console.log("UploadFile.ts - Response received:", {
      status: response.status,
      data: response.data
    });

    if (response.status !== 200) {
      console.error("UploadFile.ts - Non-200 status:", response.status, response.data);
      throw new Error("Failed to upload file");
    }

    console.log("UploadFile.ts - Upload successful:", response.data);
    return response.data as UploadFileResponse;
  } catch (error) {
    console.error("UploadFile.ts - Error occurred:", error);
    throw error;
  }
}; 