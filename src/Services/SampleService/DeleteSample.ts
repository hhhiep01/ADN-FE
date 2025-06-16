import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export interface DeleteSampleRequest {
  id: number;
}

export const deleteSample = async (id: number): Promise<any> => {
  try {
    const response = await httpClient.delete({
      url: apiLinks.Sample.delete(id.toString()),
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData.errorMessage || "Failed to delete sample");
    }
    return response.data;
  } catch (error) {
    console.error("Error deleting sample:", error);
    throw error;
  }
};
