import { QueryClient } from "@tanstack/react-query";

const baseUrl = "https://d36ebdea44d6.ngrok-free.app/api";

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
    getByCustomer: `${baseUrl}/TestOrder/customer`,
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
  Blog: {
    getAll: `${baseUrl}/Blog`,
    create: `${baseUrl}/Blog`,
    update: `${baseUrl}/Blog`,
    getById: (id: string) => `${baseUrl}/Blog/${id}`,
    delete: (id: string) => `${baseUrl}/Blog/${id}`,
  },

  Service: {
    getAll: `${baseUrl}/Service`,
    create: `${baseUrl}/Service`,
    getById: (id: string) => `${baseUrl}/Service/${id}`,
    update: `${baseUrl}/Service`,
    delete: (id: string) => `${baseUrl}/Service/${id}`,
  },

  SampleMethod: {
    getAll: `${baseUrl}/SampleMethod`,
  },
  UserAccount: {
    getUserProfile: `${baseUrl}/UserAccount/GetUserProfile`,
    updateUserProfile: `${baseUrl}/UserAccount/UpdateUserProfile`,
  },
  Comment: {
    getById: (id: number) => `${baseUrl}/Comment/${id}`,
    getByBlogId: (blogId: number) => `${baseUrl}/Comment/blog/${blogId}`,
    create: `${baseUrl}/Comment`,
    update: `${baseUrl}/Comment`,
    delete: (id: number) => `${baseUrl}/Comment/${id}`,
  },
  LocusResult: {
    getAll: `${baseUrl}/LocusResult`,
    create: `${baseUrl}/LocusResult`,
    getById: (id: string) => `${baseUrl}/LocusResult/${id}`,
    delete: (id: string) => `${baseUrl}/LocusResult/${id}`,
    getBySampleId: (sampleId: string) => `${baseUrl}/LocusResult/by-sample/${sampleId}`,
    update: (sampleId: string) => `${baseUrl}/LocusResult/${sampleId}`,
  },
  Files: {
    upload: `${baseUrl}/Files/upload`,
    download: (fileName: string) => `${baseUrl}/Files/download/${fileName}`,
  },
};

export default apiLinks;
