import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useGetTestOrderByCustomer } from "../Services/TestOrderService/GetTestOrderByCustomer";
import type { TestOrderCustomer } from "../Services/TestOrderService/GetTestOrderByCustomer";
import { updateTestOrderDeliveryStatus } from "../Services/TestOrderService/UpdateTestOrderDeliveryStatus";
import { useQueryClient } from "@tanstack/react-query";
import { createSample, type CreateSampleRequest, type Participant } from "../Services/SampleService/CreateSample";
import { useGetAllSampleTypes } from "../Services/SampleTypeService/GetAllSampleTypes";

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
  const [showSendSampleModal, setShowSendSampleModal] = React.useState<TestOrderCustomer | null>(null);
  const [shippingProvider, setShippingProvider] = React.useState("");
  const [trackingNumber, setTrackingNumber] = React.useState("");

  // Sample types query
  const { data: sampleTypesData, isLoading: isLoadingSampleTypes } = useGetAllSampleTypes();
  const sampleTypes = sampleTypesData?.result || [];

  // State for sample creation modal
  const [showSampleModal, setShowSampleModal] = React.useState(false);
  const [selectedOrderForSample, setSelectedOrderForSample] = React.useState<TestOrderCustomer | null>(null);
  const [sampleFormData, setSampleFormData] = React.useState<CreateSampleRequest>({
    testOrderId: 0,
    participants: [
      {
        collectionDate: "",
        sampleStatus: 0,
        notes: "",
        participantName: "",
        relationship: "",
        sampleTypeId: 0,
        fingerprintImagePath: "",
      },
      {
        collectionDate: "",
        sampleStatus: 0,
        notes: "",
        participantName: "",
        relationship: "",
        sampleTypeId: 0,
        fingerprintImagePath: "",
      },
    ],
  });
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
      if (newStatus === 2) {
        alert("Xác nhận đã trả về kit thành công!");
      } else if (newStatus === 3) {
        alert("Xác nhận đã nhận kit thành công!");
      } else {
        alert("Xác nhận đã gửi kit thành công!");
      }
      await refetch();
    } catch (err) {
      alert("Cập nhật trạng thái kit thất bại!");
    }
  };

  // Sample modal handlers
  const handleShowSampleModal = (order: TestOrderCustomer) => {
    setSelectedOrderForSample(order);
    setSampleFormData({
      testOrderId: order.id,
      participants: [
        {
          collectionDate: order.appointmentDate,
          sampleStatus: 0,
          notes: "",
          participantName: order.userName || order.fullName || "",
          relationship: "Chính",
          sampleTypeId: 0,
          fingerprintImagePath: "",
        },
        {
          collectionDate: order.appointmentDate,
          sampleStatus: 0,
          notes: "",
          participantName: "",
          relationship: "",
          sampleTypeId: 0,
          fingerprintImagePath: "",
        },
      ],
    });
    setShowSampleModal(true);
  };

  const handleSampleModalClose = () => {
    setShowSampleModal(false);
    setSelectedOrderForSample(null);
  };

  const handleSampleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSampleFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParticipantChange = (index: number, field: keyof Participant, value: string | number) => {
    setSampleFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((participant, i) =>
        i === index ? { ...participant, [field]: value } : participant
      ),
    }));
  };

  const handleSampleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSample(sampleFormData);
      await handleConfirmSentKit(selectedOrderForSample!.id, 2);
      setShowSampleModal(false);
      setSelectedOrderForSample(null);
      alert("Gửi mẫu về trung tâm thành công!");
      await refetch();
    } catch (err) {
      alert("Gửi mẫu về trung tâm thất bại!");
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
                <div className="flex-1">
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
                  <div className="text-sm text-gray-500 mb-2">
                    <span className="font-medium text-gray-700">Phương pháp lấy mẫu:</span> {order.sampleMethods?.name}
                  </div>
                  {order.sampleMethods?.id !== 2 && (
                    <div className="w-full flex flex-wrap items-center gap-3 mt-2 mb-2">
                      <span className="font-medium text-gray-700">Kit Test:</span>
                      <span className="inline-block px-4 py-2 rounded-full bg-white text-indigo-700 font-semibold ml-1 border border-indigo-100 text-base">
                        {order.deliveryKitStatus === 0 ? "Chưa gửi kit"
                          : order.deliveryKitStatus === 1 ? "Đã gửi kit"
                          : order.deliveryKitStatus === 2 ? "Đã trả về kit"
                          : order.deliveryKitStatus === 3 ? "Đã nhận kit"
                          : "Khác"}
                      </span>
                      {order.sampleMethods?.id === 1 && order.deliveryKitStatus === 1 && (
                        <button
                          className="px-3 py-1 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition text-xs shadow"
                          onClick={() => handleConfirmSentKit(order.id, 3)}
                        >
                          Xác nhận đã nhận kit test
                        </button>
                      )}
                      {order.sampleMethods?.id === 1 && (order.deliveryKitStatus === 0 || order.deliveryKitStatus === 1 || order.deliveryKitStatus === 3) && (
                        <button
                          className="px-3 py-1 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition text-xs shadow"
                          onClick={() => handleShowSampleModal(order)}
                          disabled={order.deliveryKitStatus !== 3}
                        >
                          Gửi mẫu về trung tâm
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end md:items-end mt-4 md:mt-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-700">Trạng thái:</span>
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold ml-1">
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Sample Creation Modal */}
      {showSampleModal && selectedOrderForSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Mẫu gửi về trung tâm</h3>
            <form onSubmit={handleSampleFormSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã đơn hẹn
                  </label>
                  <input
                    type="number"
                    name="testOrderId"
                    value={sampleFormData.testOrderId}
                    onChange={handleSampleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn vị vận chuyển
                  </label>
                  <input
                    type="text"
                    name="shippingProvider"
                    value={shippingProvider}
                    onChange={(e) => setShippingProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập đơn vị vận chuyển"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã vận đơn
                  </label>
                  <input
                    type="text"
                    name="trackingNumber"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mã vận đơn"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Thông tin người tham gia</h4>
                {sampleFormData.participants.map((participant, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <h5 className="text-md font-medium text-gray-700 mb-3">
                      Người tham gia {index + 1}
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên người tham gia
                        </label>
                        <input
                          type="text"
                          value={participant.participantName}
                          onChange={(e) => handleParticipantChange(index, "participantName", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập tên người tham gia"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mối quan hệ
                        </label>
                        <input
                          type="text"
                          value={participant.relationship}
                          onChange={(e) => handleParticipantChange(index, "relationship", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ví dụ: Chính, Con, Vợ/Chồng..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày lấy mẫu
                        </label>
                        <input
                          type="datetime-local"
                          value={participant.collectionDate.slice(0, 16)}
                          onChange={(e) => handleParticipantChange(index, "collectionDate", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại mẫu xét nghiệm
                        </label>
                        <select
                          value={participant.sampleTypeId}
                          onChange={(e) => handleParticipantChange(index, "sampleTypeId", Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isLoadingSampleTypes}
                        >
                          <option value={0}>Chọn loại mẫu</option>
                          {sampleTypes.map((sampleType) => (
                            <option key={sampleType.id} value={sampleType.id}>
                              {sampleType.name}
                            </option>
                          ))}
                        </select>
                        {isLoadingSampleTypes && (
                          <p className="text-sm text-gray-500 mt-1">Đang tải danh sách loại mẫu...</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trạng thái mẫu
                        </label>
                        <input
                          type="text"
                          value="Chờ xử lý"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                          readOnly
                          disabled
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ghi chú
                        </label>
                        <textarea
                          value={participant.notes}
                          onChange={(e) => handleParticipantChange(index, "notes", e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập ghi chú cho người tham gia này"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleSampleModalClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Gửi mẫu về trung tâm
                </button>
              </div>
            </form>
          </div>
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
