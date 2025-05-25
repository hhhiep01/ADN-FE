
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-white rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Dịch vụ xét nghiệm ADN huyết thống
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Cung cấp dịch vụ xét nghiệm ADN chính xác, nhanh chóng và bảo mật
        </p>
        <Link 
          to="/appointment" 
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Đặt lịch ngay
        </Link>
      </section>

      {/* Services Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Xét nghiệm ADN dân sự</h2>
          <p className="text-gray-600 mb-4">
            Xác định mối quan hệ huyết thống cho mục đích cá nhân với độ chính xác 99.99%
          </p>
          <Link to="/services" className="text-blue-600 hover:text-blue-700">
            Tìm hiểu thêm →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Xét nghiệm ADN hành chính</h2>
          <p className="text-gray-600 mb-4">
            Xác nhận quan hệ huyết thống cho các thủ tục pháp lý, được chấp nhận bởi các cơ quan nhà nước
          </p>
          <Link to="/services" className="text-blue-600 hover:text-blue-700">
            Tìm hiểu thêm →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Thu mẫu tại nhà</h2>
          <p className="text-gray-600 mb-4">
            Dịch vụ thu mẫu tận nơi, tiện lợi và nhanh chóng, đảm bảo quy trình vô trùng
          </p>
          <Link to="/services" className="text-blue-600 hover:text-blue-700">
            Tìm hiểu thêm →
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Tại sao chọn chúng tôi?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">99.99%</div>
            <p className="text-gray-600">Độ chính xác</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">3-5</div>
            <p className="text-gray-600">Ngày có kết quả</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
            <p className="text-gray-600">Bảo mật thông tin</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <p className="text-gray-600">Hỗ trợ khách hàng</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 