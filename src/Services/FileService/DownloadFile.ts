import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export const downloadFile = async (fileName: string): Promise<Blob> => {
  try {
    const response = await httpClient.get({
      url: apiLinks.Files.download(fileName),
      responseType: 'blob', // Quan trọng để nhận file binary
    });

    if (response.status !== 200) {
      throw new Error("Failed to download file");
    }

    return response.data as Blob;
  } catch (error) {
    console.error("Download file error:", error);
    throw new Error("Không thể tải xuống file");
  }
};

// Hàm helper để tải xuống file và mở trong tab mới
export const downloadAndOpenFile = async (fileName: string, displayName?: string) => {
  try {
    const blob = await downloadFile(fileName);
    
    // Tạo URL cho blob
    const url = window.URL.createObjectURL(blob);
    
    // Tạo link để download
    const link = document.createElement('a');
    link.href = url;
    link.download = displayName || fileName;
    link.target = '_blank';
    
    // Thêm vào DOM và click
    document.body.appendChild(link);
    link.click();
    
    // Dọn dẹp
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log("File downloaded successfully:", fileName);
  } catch (error) {
    console.error("Download and open file error:", error);
    throw error;
  }
}; 