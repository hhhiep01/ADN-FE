import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const apiLinks = {
  Auth: {
    Loginwithgoogle: '/Auth/signin-google',
    login: '/Auth/login',
    register: '/Auth/register',
    confirmEmail: '/Auth/confirmation',
  },
};