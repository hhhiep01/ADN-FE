import { QueryClient } from "@tanstack/react-query";

const baseUrl = "https://3c8a-118-69-182-149.ngrok-free.app/api";

export const queryClient = new QueryClient();

export const apiLinks = {
  Auth: {
    login: `${baseUrl}/Auth/login`,
    register: `${baseUrl}/Auth/register`,
    confirmEmail: `${baseUrl}/Auth/confirmation`,
    verification: `${baseUrl}/Auth/verification`,
  },
};