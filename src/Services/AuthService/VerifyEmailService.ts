import httpClient from "../../httpClient/httpClient";
import { apiLinks } from "../MainService";

interface VerifyEmailRequest {
    userId: number;
    verificationCode: string;
}

export const verifyEmail = async (data: VerifyEmailRequest) => {
    try {
      const response = await httpClient.post({
        url: apiLinks.Auth.verification,
        data: data,
      });
      return response.data;
    } catch (error: unknown) {
      throw error; 
    }
  }; 