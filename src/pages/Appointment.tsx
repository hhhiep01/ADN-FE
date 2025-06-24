import React, { useState } from "react";
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
  const [thongBaoLoi, setThongBaoLoi] = useState<string>("");
  const [thongBaoThanhCong, setThongBaoThanhCong] = useState<string>("");

  const [formData, setFormData] = useState<DuLieuDatLich>({
    hoTen: "",
    email: "",
    soDienThoai: "",
    phuongThucThuMauId: "",
    loaiXetNghiemId: "",
    appointmentDate: "",
    appointmentLocation: "",
  });

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

    const requestData: CreateTestOrderRequest = {
      fullName: formData.hoTen,
      email: formData.email,
      phoneNumber: formData.soDienThoai,
      sampleMethodId: parseInt(formData.phuongThucThuMauId, 10),
      serviceId: parseInt(formData.loaiXetNghiemId, 10),
      appointmentDate: formData.appointmentDate,
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
            <div className="mx-8 mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {thongBaoThanhCong}
            </div>
          )}

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập họ và tên của bạn"
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập địa chỉ email của bạn"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập số điện thoại của bạn"
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
                      {xetNghiem.name}
                    </option>
                  ))}
                </select>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 group">
                <label
                  htmlFor="appointmentDate"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <span className="mr-2 text-blue-600">
                    <FaNotesMedical />
                  </span>
                  Ngày hẹn
                </label>
                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Chọn ngày hẹn"
                />
              </div>
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
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập địa điểm hẹn"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={
                  isTaoDonDatLichPending ||
                  dangTaiPhuongThuc ||
                  dangTaiXetNghiem
                }
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center disabled:opacity-50"
              >
                {isTaoDonDatLichPending ? "Đang xử lý..." : "Đặt lịch ngay"}
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
