import { QueryClient } from "@tanstack/react-query";

const baseUrl = "https://9a58-118-69-182-144.ngrok-free.app/api";

export const queryClient = new QueryClient();

export const apiLinks = {
  Auth: {
    login: `${baseUrl}/Auth/login`,
    register: `${baseUrl}/Auth/register`,
    confirmEmail: `${baseUrl}/Auth/confirmation`,
    verification: `${baseUrl}/Auth/verification`,
  },
  TestOrder: {
    getAll: `${baseUrl}/TestOrder`,
    create: `${baseUrl}/TestOrder`,
    update: `${baseUrl}/TestOrder`,
    getById: (id: string) => `${baseUrl}/TestOrder/${id}`,
    delete: (id: string) => `${baseUrl}/TestOrder/${id}`,
    updateStatus: `${baseUrl}/TestOrder/status`,
    updateDeliveryKitStatus: `${baseUrl}/TestOrder/delivery-kit-status`,
    updateAppointmentStatus: `${baseUrl}/TestOrder/appointment-status`,
  },
  Sample: {
    getAll: `${baseUrl}/Sample`,
    create: `${baseUrl}/Sample`,
    getById: (id: string) => `${baseUrl}/Sample/${id}`,
    update: `${baseUrl}/Sample`,
    delete: (id: string) => `${baseUrl}/Sample/${id}`,
    getByTestOrderId: (testOrderId: string) =>
      `${baseUrl}/Sample/test-order/${testOrderId}`,
    getByCollectorId: (collectorId: string) =>
      `${baseUrl}/Sample/collector/${collectorId}`,
  },
  Result: {
    getAll: `${baseUrl}/Result`,
    create: `${baseUrl}/Result`,
    getById: (id: string) => `${baseUrl}/Result/${id}`,
    update: (id: string) => `${baseUrl}/Result/${id}`,
    delete: (id: string) => `${baseUrl}/Result/${id}`,
    userHistory: `${baseUrl}/Result/user-history`,
  },
  SampleMethod: {
    getAll: `${baseUrl}/SampleMethod`,
  },
  Service: {
    getAll: `${baseUrl}/Service`,
  },
  Blog: {
    getAll: `${baseUrl}/Blog`,
    create: `${baseUrl}/Blog`,
    update: `${baseUrl}/Blog`,
    getById: (id: string) => `${baseUrl}/Blog/${id}`,
    delete: (id: string) => `${baseUrl}/Blog/${id}`,
  },
  UserAccount: {
    getUserProfile: `${baseUrl}/UserAccount/GetUserProfile`,
    updateUserProfile: `${baseUrl}/UserAccount/UpdateUserProfile`,
  },
};
