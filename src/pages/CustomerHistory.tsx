import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useGetTestOrderByCustomer } from "../Services/TestOrderService/GetTestOrderByCustomer";
import type { TestOrderCustomer } from "../Services/TestOrderService/GetTestOrderByCustomer";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  sampleMethods: any[];
  image: string;
}

interface SampleMethod {
  id: number;
  name: string;
}

interface TestOrder {
  id: number;
  userId: number;
  userName: string | null;
  phoneNumber: string;
  email: string;
  fullName: string;
  services: Service;
  sampleMethods: SampleMethod;
  status: number;
  deliveryKitStatus: number | null;
  kitSendDate: string | null;
  appointmentDate: string;
  appointmentLocation: string;
  appointmentStaffId: number | null;
  appointmentStaffName: string | null;
}

const CustomerHistory: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useGetTestOrderByCustomer();
  console.log("API response:", data);
  if (error) {
    console.error("API error:", error);
  }
  const orders: TestOrderCustomer[] =
    data &&
    typeof data === "object" &&
    "result" in data &&
    Array.isArray((data as any).result)
      ? (data as any).result
      : [];
  console.log("Orders:", orders);

  if (!user) {
    return <div>Đang kiểm tra đăng nhập...</div>;
  }
  if (user.role.toLowerCase() !== "customer") {
    return <div>Bạn không có quyền truy cập trang này.</div>;
  }

  if (isLoading) {
    return <div>Đang tải...</div>;
  }
  if (isError) {
    return (
      <div>Lỗi: {error?.message || "Không thể tải lịch sử xét nghiệm!"}</div>
    );
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Đã xác nhận";
      case 2:
        return "Đã hoàn thành";
      case 3:
        return "Đã hủy";
      default:
        return "Khác";
    }
  };

  const isTrungTam = (location?: string | null) => {
    if (!location) return false;
    const normalized = location.trim().toLowerCase();
    return (
      normalized.includes("trung tâm") ||
      normalized.includes("trungtam") ||
      normalized === "hcm" ||
      normalized.includes("center")
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Lịch sử lịch hẹn của bạn
      </h2>
      {orders.length === 0 ? (
        <div>Bạn chưa có lịch sử lịch hẹn nào.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg shadow p-4 bg-white mb-4"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                <div>
                  <div className="font-semibold text-blue-700">
                    {order.services?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Ngày hẹn:{" "}
                    {order.appointmentDate
                      ? new Date(order.appointmentDate).toLocaleDateString()
                      : "---"}
                  </div>
                  <div className="text-sm text-gray-500">
                    Địa điểm: {order.appointmentLocation}
                  </div>
                  <div className="text-sm text-gray-500">
                    Phương pháp lấy mẫu: {order.sampleMethods?.name}
                  </div>
                </div>
                <div className="mt-2 md:mt-0 text-sm">
                  <span className="font-medium">Trạng thái:</span>{" "}
                  {getStatusText(order.status)}
                  {order.deliveryKitStatus !== undefined &&
                    order.deliveryKitStatus !== null &&
                    order.appointmentLocation &&
                    !isTrungTam(order.appointmentLocation) && (
                      <div>
                        <span className="font-medium">Kit Test:</span>{" "}
                        {order.deliveryKitStatus === 0
                          ? "Chưa gửi kit"
                          : order.deliveryKitStatus === 1
                          ? "Đã gửi kit"
                          : "Khác"}
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerHistory;
