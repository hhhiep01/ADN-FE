import { QueryClient } from "@tanstack/react-query";

const baseUrl = "https://localhost:7046/api";

export const queryClient = new QueryClient();

export const apiLinks = {
  Auth: {
    Loginwithgoogle: `${baseUrl}/Auth/signin-google`,
    login: `${baseUrl}/Auth/login`,
    register: `${baseUrl}/Auth/register`,
    confirmEmail: `${baseUrl}/Auth/confirmation`,
    verification: `${baseUrl}/Auth/verification`,
  },
};