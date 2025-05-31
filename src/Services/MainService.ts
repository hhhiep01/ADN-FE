import { QueryClient } from "@tanstack/react-query";

const baseUrl = "https://b05e-118-69-182-144.ngrok-free.app/api";

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