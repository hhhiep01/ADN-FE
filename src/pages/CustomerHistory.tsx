import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useGetTestOrderByCustomer } from "../Services/TestOrderService/GetTestOrderByCustomer";
import type { TestOrderCustomer } from "../Services/TestOrderService/GetTestOrderByCustomer";
import { updateTestOrderDeliveryStatus } from "../Services/TestOrderService/UpdateTestOrderDeliveryStatus";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useGetTestOrderByCustomer();
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

  const handleConfirmSentKit = async (orderId: number, newStatus: number) => {
    try {
      await updateTestOrderDeliveryStatus({ id: orderId, deliveryKitStatus: newStatus });
      alert(newStatus === 2 ? "Xác nhận đã trả về kit thành công!" : "Xác nhận đã gửi kit thành công!");
      await refetch();
    } catch (err) {
      alert("Cập nhật trạng thái kit thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-2">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center drop-shadow-sm">
        Lịch sử lịch hẹn của bạn
      </h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-600 bg-white rounded-2xl shadow-lg p-8 max-w-xl mx-auto">
          Bạn chưa có lịch sử lịch hẹn nào.
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg p-6 mb-4 transition hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-4">
                <div>
                  <div className="font-semibold text-blue-700 text-lg mb-1">
                    {order.services?.name}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    <span className="font-medium text-gray-700">Ngày hẹn:</span>{" "}
                    {order.appointmentDate
                      ? new Date(order.appointmentDate).toLocaleDateString()
                      : "---"}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    <span className="font-medium text-gray-700">Địa điểm:</span> {order.appointmentLocation}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Phương pháp lấy mẫu:</span> {order.sampleMethods?.name}
                  </div>
                </div>
                <div className="mt-2 md:mt-0 text-sm text-right min-w-[140px]">
                  <span className="font-medium text-gray-700">Trạng thái:</span>{" "}
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold ml-1">
                    {getStatusText(order.status)}
                  </span>
                  {order.deliveryKitStatus !== undefined &&
                    order.deliveryKitStatus !== null &&
                    order.appointmentLocation &&
                    !isTrungTam(order.appointmentLocation) &&
                    order.sampleMethods?.id !== 2 && (
                      <div className="mt-2">
                        <span className="font-medium text-gray-700">Kit Test:</span>{" "}
                        {order.sampleMethods?.id === 1 && order.deliveryKitStatus === 1 ? (
                          <button
                            className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold ml-1 hover:bg-indigo-100 transition"
                            onClick={() => handleConfirmSentKit(order.id, 2)}
                            title="Bấm để xác nhận đã trả về kit"
                          >
                            Đã gửi kit (bấm để xác nhận trả về)
                          </button>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold ml-1">
                            {order.deliveryKitStatus === 0
                              ? "Chưa gửi kit"
                              : order.deliveryKitStatus === 1
                              ? "Đã gửi kit"
                              : order.deliveryKitStatus === 2
                              ? "Đã trả về kit"
                              : "Khác"}
                          </span>
                        )}
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

export default function CustomerHistoryWithFooter() {
  return (
    <>
      <CustomerHistory />
      <Footer />
    </>
  );
}

// Footer
const Footer = () => (
  <footer className="bg-[#f5f6fa] border-t mt-16 pt-10 pb-8">
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800">
      <div>
        <div className="font-bold mb-2">Công ty Cổ phần ADN Testing</div>
        <div className="text-sm mb-1">
          Lô B4/D21, Khu đô thị mới Cầu Giấy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội
        </div>
        <div className="text-sm mb-1">
          ĐKKD số. 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/2015
        </div>
        <div className="text-sm mb-1">024-7301-2468 (7h - 18h)</div>
        <div className="text-sm mb-1">support@adntesting.vn (7h - 18h)</div>
        <div className="text-sm mb-1">
          Văn phòng tại TP Hồ Chí Minh: Tòa nhà H3, 384 Hoàng Diệu, Phường 6, Quận 4, TP.HCM
        </div>
        <div className="flex gap-2 mt-2">
          <img src="/logodk.png" alt="Đã đăng ký" className="h-7" />
          <img src="/logodk.png" alt="Đã thông báo" className="h-7" />
        </div>
      </div>
      <div>
        <div className="font-bold mb-2 text-[#00b6f3] flex items-center gap-2">
          <img
            src="https://bookingcare.vn/assets/icon/bookingcare.svg"
            alt="logo"
            className="w-7 h-7"
          />{" "}
          ADN Testing
        </div>
        <ul className="text-sm space-y-1">
          <li>Liên hệ hợp tác</li>
          <li>Chính sách bảo mật</li>
          <li>Quy chế hoạt động</li>
          <li>Tuyển dụng</li>
          <li>Điều khoản sử dụng</li>
          <li>Câu hỏi thường gặp</li>
          <li className="text-[#00b6f3] mt-2">/ ADN</li>
        </ul>
      </div>
      <div>
        <div className="font-bold mb-2">Đối tác bảo trợ nội dung</div>
        <ul className="text-sm space-y-4">
          <li className="flex items-center gap-4">
            <img
              src="/hellodoctor.png"
              alt="Hello Doctor"
              className="w-20 h-14 object-contain"
            />
            <div>
              <span className="font-semibold text-lg">Hello Doctor</span>
              <br />
              <span>Bảo trợ chuyên mục nội dung "sức khỏe tinh thần"</span>
            </div>
          </li>
          <li className="flex items-center gap-4">
            <img
              src="/Bernard.png"
              alt="Bernard Healthcare"
              className="w-20 h-14 object-contain"
            />
            <div>
              <span className="font-semibold text-lg">
                Hệ thống y khoa chuyên sâu quốc tế Bernard
              </span>
              <br />
              <span>Bảo trợ chuyên mục nội dung "y khoa chuyên sâu"</span>
            </div>
          </li>
          <li className="flex items-center gap-4">
            <img
              src="/doctorcheck.png"
              alt="Doctor Check"
              className="w-20 h-14 object-contain"
            />
            <div>
              <span className="font-semibold text-lg">
                Doctor Check - Tầm Soát Bệnh Để Sống Thọ Hơn
              </span>
              <br />
              <span>Bảo trợ chuyên mục nội dung "sức khỏe tổng quát"</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </footer>
);
