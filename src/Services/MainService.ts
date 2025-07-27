import { QueryClient } from "@tanstack/react-query";

const baseUrl = "https://576410a88226.ngrok-free.app/api";

export const queryClient = new QueryClient();

// Định nghĩa các đường dẫn API chính cho toàn bộ hệ thống
export const apiLinks = {
  Auth: {
    // Đăng nhập, đăng ký, xác thực, xác nhận email
    login: `${baseUrl}/Auth/login`,
    register: `${baseUrl}/Auth/register`,
    confirmEmail: `${baseUrl}/Auth/confirmation`,
    verification: `${baseUrl}/Auth/verification`,
  },
  TestOrder: {
    // Quản lý đơn hẹn: lấy, tạo, cập nhật, xóa, cập nhật trạng thái
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
    // Quản lý mẫu xét nghiệm: lấy, tạo, cập nhật, xóa, lấy theo đơn hẹn hoặc người lấy mẫu
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
    // Quản lý kết quả xét nghiệm: lấy, tạo, cập nhật, xóa, lịch sử người dùng
    getAll: `${baseUrl}/Result`,
    create: `${baseUrl}/Result`,
    getById: (id: string) => `${baseUrl}/Result/${id}`,
    update: (id: string) => `${baseUrl}/Result/${id}`,
    delete: (id: string) => `${baseUrl}/Result/${id}`,
    userHistory: `${baseUrl}/Result/user-history`,
  },
  Blog: {
    // Quản lý blog: lấy, tạo, cập nhật, xóa
    getAll: `${baseUrl}/Blog`,
    create: `${baseUrl}/Blog`,
    update: `${baseUrl}/Blog`,
    getById: (id: string) => `${baseUrl}/Blog/${id}`,
    delete: (id: string) => `${baseUrl}/Blog/${id}`,
  },
  Service: {
    // Quản lý dịch vụ xét nghiệm
    getAll: `${baseUrl}/Service`,
    create: `${baseUrl}/Service`,
    getById: (id: string) => `${baseUrl}/Service/${id}`,
    update: `${baseUrl}/Service`,
    delete: (id: string) => `${baseUrl}/Service/${id}`,
  },
  SampleMethod: {
    // Lấy danh sách phương thức lấy mẫu
    getAll: `${baseUrl}/SampleMethod`,
  },
  UserAccount: {
    // Quản lý tài khoản người dùng
    getUserProfile: `${baseUrl}/UserAccount/GetUserProfile`,
    updateUserProfile: `${baseUrl}/UserAccount/UpdateUserProfile`,
  },
  Comment: {
    // Quản lý bình luận cho blog
    getById: (id: number) => `${baseUrl}/Comment/${id}`,
    getByBlogId: (blogId: number) => `${baseUrl}/Comment/blog/${blogId}`,
    create: `${baseUrl}/Comment`,
    update: `${baseUrl}/Comment`,
    delete: (id: number) => `${baseUrl}/Comment/${id}`,
  },
  LocusResult: {
    // Quản lý kết quả locus (gen)
    getAll: `${baseUrl}/LocusResult`,
    create: `${baseUrl}/LocusResult`,
    getById: (id: string) => `${baseUrl}/LocusResult/${id}`,
    delete: (id: string) => `${baseUrl}/LocusResult/${id}`,
    getBySampleId: (sampleId: string) => `${baseUrl}/LocusResult/by-sample/${sampleId}`,
    update: (sampleId: string) => `${baseUrl}/LocusResult/${sampleId}`,
  },
  Files: {
    // Upload và download file
    upload: `${baseUrl}/Files/upload`,
    download: (fileName: string) => `${baseUrl}/Files/download/${fileName}`,
  },
};

export default apiLinks;
