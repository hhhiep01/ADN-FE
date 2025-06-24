import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";

export const deleteService = async (id: string): Promise<void> => {
  const response = await httpClient.delete({
    url: apiLinks.Service.delete(id)
  });
  return response.data;
}; 