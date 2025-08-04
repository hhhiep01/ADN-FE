import { apiLinks } from "../MainService";
import httpClient from "../../httpClient/httpClient";
import type { GetAllAccountsResponse } from "./UserAccountInterface";

export const getAllAccounts = async (): Promise<GetAllAccountsResponse> => {
  try {
    const response = await httpClient.get({
      url: apiLinks.UserAccount.getAllAccounts,
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(
        errorData.errorMessage || errorData.result || "Failed to get all accounts"
      );
    }

    return response.data as GetAllAccountsResponse;
  } catch (error) {
    console.error("Error getting all accounts:", error);
    throw error;
  }
}; 