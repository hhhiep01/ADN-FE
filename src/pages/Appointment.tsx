import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaFlask,
  FaArrowRight,
  FaNotesMedical,
} from "react-icons/fa";
import {
  useCreateTestOrder,
  type CreateTestOrderRequest,
} from "../Services/TestOrderService/CreateTestOrder";
import { useGetAllSampleMethods } from "../Services/SampleMethodService/GetAllSampleMethods";
import { useGetAllServices } from "../Services/ServiceService/GetAllServices";
import { useGetUserProfile } from "../Services/UserAccountService/GetUserProfile";
import type { Service } from "../Services/ServiceService/GetAllServices";
import { createSample, type CreateSampleRequest } from "../Services/SampleService/CreateSample";

interface DuLieuDatLich {
  hoTen: string;
  email: string;
  soDienThoai: string;
  phuongThucThuMauId: string;
  loaiXetNghiemId: string;
  appointmentDate: string;
  appointmentLocation: string;
}

const Appointment = () => {
  const location = useLocation();
  const selectedService = location.state?.selectedService as Service | undefined;
  
  const [thongBaoLoi, setThongBaoLoi] = useState<string>("");
  const [thongBaoThanhCong, setThongBaoThanhCong] = useState<string>("");
  const [appointmentDateTime, setAppointmentDateTime] = useState("");

  const [formData, setFormData] = useState<DuLieuDatLich>({
    hoTen: "",
    email: "",
    soDienThoai: "",
    phuongThucThuMauId: "",
    loaiXetNghiemId: selectedService ? selectedService.id.toString() : "",
    appointmentDate: "",
    appointmentLocation: "",
  });

  // Lấy thông tin user từ API
  const {
    data: userProfileResponse,
    isLoading: dangTaiThongTinUser,
    error: loiThongTinUser,
  } = useGetUserProfile();

  // Tự động điền thông tin user khi có dữ liệu
  useEffect(() => {
    if (userProfileResponse?.isSuccess && userProfileResponse.result) {
      const userProfile = userProfileResponse.result;
      setFormData((prev) => ({
        ...prev,
        hoTen: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
        email: userProfile.email || "",
        soDienThoai: userProfile.phoneNumber || "",
      }));
    }
  }, [userProfileResponse]);

  // Lấy danh sách phương thức thu mẫu
  const {
    data: sampleMethodsResponse,
    isLoading: dangTaiPhuongThuc,
    error: loiPhuongThuc,
  } = useGetAllSampleMethods();
  const danhSachPhuongThuc = sampleMethodsResponse?.result;

  // Lấy danh sách loại xét nghiệm
  const {
    data: servicesResponse,
    isLoading: dangTaiXetNghiem,
    error: loiXetNghiem,
  } = useGetAllServices();
  const danhSachXetNghiem = servicesResponse?.result;

  // Lấy thông tin giá của dịch vụ được chọn
  const selectedServiceInfo = danhSachXetNghiem?.find(
    (service) => service.id.toString() === formData.loaiXetNghiemId
  );

  // Tạo đơn đặt lịch
  const { mutate: taoDonDatLich, isPending: isTaoDonDatLichPending } =
    useCreateTestOrder();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Nếu chọn "Lấy mẫu tại trung tâm" (id: 2), xóa địa điểm hẹn
    if (name === "phuongThucThuMauId" && value === "2") {
      setFormData((prev) => ({
        ...prev,
        appointmentLocation: "",
      }));
    }
    
    setThongBaoLoi("");
    setThongBaoThanhCong("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setThongBaoLoi("");
    setThongBaoThanhCong("");

    // Kiểm tra dữ liệu trước khi gửi
    if (!formData.hoTen.trim()) {
      setThongBaoLoi("Vui lòng nhập họ và tên");
      return;
    }
    if (!formData.email.trim()) {
      setThongBaoLoi("Vui lòng nhập email");
      return;
    }
    if (!formData.soDienThoai.trim()) {
      setThongBaoLoi("Vui lòng nhập số điện thoại");
      return;
    }
    if (!formData.phuongThucThuMauId) {
      setThongBaoLoi("Vui lòng chọn phương thức thu mẫu");
      return;
    }
    if (!formData.loaiXetNghiemId) {
      setThongBaoLoi("Vui lòng chọn loại xét nghiệm");
      return;
    }
    if (!appointmentDateTime) {
      setThongBaoLoi("Vui lòng chọn ngày hẹn");
      return;
    }
    if (formData.phuongThucThuMauId !== "2" && !formData.appointmentLocation.trim()) {
      setThongBaoLoi("Vui lòng nhập địa điểm hẹn");
      return;
    }

    const requestData: CreateTestOrderRequest = {
      fullName: formData.hoTen,
      email: formData.email,
      phoneNumber: formData.soDienThoai,
      sampleMethodId: parseInt(formData.phuongThucThuMauId, 10),
      serviceId: parseInt(formData.loaiXetNghiemId, 10),
      appointmentDate: appointmentDateTime,
      appointmentLocation: formData.appointmentLocation,
    };

    taoDonDatLich(requestData, {
      onSuccess: () => {
        setThongBaoThanhCong(
          "Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất."
        );
        setFormData({
          hoTen: "",
          email: "",
          soDienThoai: "",
          phuongThucThuMauId: "",
          loaiXetNghiemId: "",
          appointmentDate: "",
          appointmentLocation: "",
        });
        setThongBaoLoi("");
      },
      onError: (error: any) => {
        setThongBaoLoi(parseErrorMessage(error));
        setThongBaoThanhCong("");
      },
    });
  };

  // Thêm hàm parseErrorMessage giống bên ResultManagement
  const parseErrorMessage = (err: any) => {
    if (err?.data?.result) return err.data.result;
    if (err?.response?.data?.errorMessage)
      return err.response.data.errorMessage;
    if (err?.message && typeof err.message === "string") {
      let msg = err.message.trim();
      if (msg.startsWith("Error: ")) {
        msg = msg.slice(7);
      }
      if (msg.startsWith("{") && msg.endsWith("}")) {
        try {
          const parsed = JSON.parse(msg);
          return (
            parsed.result ||
            parsed.errorMessage ||
            parsed.message ||
            "Lỗi không xác định"
          );
        } catch {
          return err.message;
        }
      }
      return msg;
    }
    return "Lỗi không xác định";
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Đặt lịch xét nghiệm ADN
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Điền thông tin bên dưới để đặt lịch xét nghiệm ADN. Chúng tôi sẽ
            liên hệ với bạn trong thời gian sớm nhất.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 bg-blue-600">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-2">
                <FaFlask />
              </span>
              Thông tin đặt lịch
            </h2>
          </div>

          {thongBaoLoi && (
            <div className="mx-8 mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {thongBaoLoi}
            </div>
          )}

          {thongBaoThanhCong && (
            <div className="mx-8 mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex flex-col items-center">
              {thongBaoThanhCong}
              <button
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                onClick={() => navigate("/customer/history")}
              >
                Xem lịch sử đặt lịch
              </button>
            </div>
          )}

          {!thongBaoThanhCong && (
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label
                    htmlFor="hoTen"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <span className="mr-2 text-blue-600">
                      <FaUser />
                    </span>
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="hoTen"
                    name="hoTen"
                    value={formData.hoTen}
                    onChange={handleChange}
                    required
                    disabled={dangTaiThongTinUser}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={dangTaiThongTinUser ? "Đang tải thông tin..." : "Nhập họ và tên của bạn"}
                  />
                  {dangTaiThongTinUser && (
                    <p className="mt-1 text-sm text-gray-500">
                      Đang tải thông tin cá nhân...
                    </p>
                  )}
                  {loiThongTinUser && (
                    <p className="mt-1 text-sm text-red-500">
                      Không thể tải thông tin cá nhân
                    </p>
                  )}
                </div>
                <div className="space-y-2 group">
                  <label
                    htmlFor="email"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <span className="mr-2 text-blue-600">
                      <FaEnvelope />
                    </span>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={dangTaiThongTinUser}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={dangTaiThongTinUser ? "Đang tải thông tin..." : "Nhập địa chỉ email của bạn"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label
                    htmlFor="soDienThoai"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <span className="mr-2 text-blue-600">
                      <FaPhone />
                    </span>
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="soDienThoai"
                    name="soDienThoai"
                    value={formData.soDienThoai}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    title="Vui lòng nhập số điện thoại 10 chữ số"
                    disabled={dangTaiThongTinUser}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={dangTaiThongTinUser ? "Đang tải thông tin..." : "Nhập số điện thoại của bạn"}
                  />
                </div>
                <div className="space-y-2 group">
                  <label
                    htmlFor="phuongThucThuMauId"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <span className="mr-2 text-blue-600">
                      <FaFlask />
                    </span>
                    Phương thức thu mẫu
                  </label>
                  <select
                    id="phuongThucThuMauId"
                    name="phuongThucThuMauId"
                    value={formData.phuongThucThuMauId}
                    onChange={handleChange}
                    required
                    disabled={dangTaiPhuongThuc}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Chọn phương thức thu mẫu</option>
                    {danhSachPhuongThuc?.map((phuongThuc) => (
                      <option key={phuongThuc.id} value={phuongThuc.id}>
                        {phuongThuc.name}
                      </option>
                    ))}
                  </select>
                  {dangTaiPhuongThuc && (
                    <p className="mt-1 text-sm text-gray-500">
                      Đang tải danh sách phương thức...
                    </p>
                  )}
                  {loiPhuongThuc && (
                    <p className="mt-1 text-sm text-red-500">
                      Không thể tải danh sách phương thức thu mẫu
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label
                    htmlFor="loaiXetNghiemId"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <span className="mr-2 text-blue-600">
                      <FaFlask />
                    </span>
                    Loại xét nghiệm
                  </label>
                  <select
                    id="loaiXetNghiemId"
                    name="loaiXetNghiemId"
                    value={formData.loaiXetNghiemId}
                    onChange={handleChange}
                    required
                    disabled={dangTaiXetNghiem}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Chọn loại xét nghiệm</option>
                    {danhSachXetNghiem?.map((xetNghiem) => (
                      <option key={xetNghiem.id} value={xetNghiem.id}>
                        {xetNghiem.name} - {xetNghiem.price?.toLocaleString()} đ
                      </option>
                    ))}
                  </select>
                  {selectedServiceInfo && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">
                          Giá dịch vụ:
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {selectedServiceInfo.price?.toLocaleString()} đ
                        </span>
                      </div>
                      {selectedServiceInfo.description && (
                        <p className="mt-1 text-xs text-green-700">
                          {selectedServiceInfo.description}
                        </p>
                      )}
                    </div>
                  )}
                  {dangTaiXetNghiem && (
                    <p className="mt-1 text-sm text-gray-500">
                      Đang tải danh sách xét nghiệm...
                    </p>
                  )}
                  {loiXetNghiem && (
                    <p className="mt-1 text-sm text-red-500">
                      Không thể tải danh sách loại xét nghiệm
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                <div className="space-y-2 group">
                  <label htmlFor="appointmentDateTime" className="flex items-center text-sm font-medium text-gray-700">
                    <span className="mr-2 text-blue-600"><FaNotesMedical /></span>Ngày & giờ hẹn
                  </label>
                  <input
                    type="datetime-local"
                    id="appointmentDateTime"
                    name="appointmentDateTime"
                    value={appointmentDateTime}
                    onChange={e => setAppointmentDateTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Chọn ngày & giờ hẹn"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label
                    htmlFor="appointmentLocation"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <span className="mr-2 text-blue-600">
                      <FaNotesMedical />
                    </span>
                    Địa điểm hẹn
                  </label>
                  <input
                    type="text"
                    id="appointmentLocation"
                    name="appointmentLocation"
                    value={formData.appointmentLocation}
                    onChange={handleChange}
                    required={formData.phuongThucThuMauId !== "2"}
                    disabled={formData.phuongThucThuMauId === "2"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={formData.phuongThucThuMauId === "2" ? "Không cần nhập khi lấy mẫu tại trung tâm" : "Nhập địa điểm hẹn"}
                  />
                  {formData.phuongThucThuMauId === "2" && (
                    <p className="mt-1 text-sm text-gray-500">
                      Không cần nhập địa điểm hẹn khi chọn lấy mẫu tại trung tâm
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={
                    isTaoDonDatLichPending ||
                    dangTaiPhuongThuc ||
                    dangTaiXetNghiem ||
                    dangTaiThongTinUser
                  }
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center disabled:opacity-50"
                >
                  {isTaoDonDatLichPending ? "Đang xử lý..." : "Đặt lịch ngay"}
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

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

export default () => (<>
  <Appointment />
  <Footer />
</>);
