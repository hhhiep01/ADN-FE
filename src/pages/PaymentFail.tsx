import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle, FaHome } from "react-icons/fa";

const PaymentFail: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-red-500 to-red-600">
            <div className="flex items-center justify-center">
              <FaTimesCircle className="text-white text-4xl mr-4" />
              <h1 className="text-3xl font-bold text-white">
                Thanh toán thất bại!
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTimesCircle className="text-red-600 text-4xl" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Rất tiếc, thanh toán không thành công!
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Có vẻ như đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-red-800 mb-3">
                  Có thể do các nguyên nhân sau:
                </h3>
                <ul className="text-left text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Thông tin thẻ không chính xác hoặc thẻ bị từ chối</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Kết nối mạng không ổn định</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Ngân hàng tạm thời từ chối giao dịch</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Hệ thống thanh toán đang bảo trì</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center">
              <button
                onClick={handleGoToHome}
                className="flex items-center justify-center px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-lg"
              >
                <FaHome className="mr-2" />
                Về trang chủ
              </button>
            </div>

            {/* Contact Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                Cần hỗ trợ? Liên hệ với chúng tôi:
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>📞 024-7301-2468 (7h - 18h)</p>
                <p>📧 support@adntesting.vn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer component
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

export default function PaymentFailWithFooter() {
  return (
    <>
      <PaymentFail />
      <Footer />
    </>
  );
} 