import httpClient from "../../httpClient/httpClient";
import { apiLinks } from "../MainService";

interface CustomerRegisterRequest {
    userEmail: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
}

export const customerRegister = async (data: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
}) => {
    try {
        // Transform data for backend
        const requestData: CustomerRegisterRequest = {
            userEmail: data.email,
            password: data.password,
            fullName: data.fullName,
            phoneNumber: data.phoneNumber
        };
        
        const response = await httpClient.post({
            url: apiLinks.Auth.register,
            data: requestData,
        });
        
        return response.data;
    } catch (error: unknown) {
        throw error;
    }
}; 