import httpClient from "../../httpClient/httpClient";
import { apiLinks } from "../MainService";

interface LoginRequest {
    userEmail: string;
    password: string;
}

export const login = async (data: { email: string; password: string }) => {
    try {
      // Transform email to userEmail for backend
      const requestData: LoginRequest = {
        userEmail: data.email,
        password: data.password
      };
      
      const response = await httpClient.post({
        url: apiLinks.Auth.login,
        data: requestData,
      });
      
      return response.data;
    } catch (error: unknown) {
      throw error; 
    }
  }; 