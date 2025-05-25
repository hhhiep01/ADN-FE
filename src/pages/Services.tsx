import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Xét nghiệm ADN cha con',
      description: 'Xác định mối quan hệ huyết thống giữa cha và con với độ chính xác 99.99%',
      price: '3.500.000 VNĐ',
      duration: '3-5 ngày',
      features: [
        'Kết quả chính xác 99.99%',
        'Bảo mật thông tin tuyệt đối',
        'Hỗ trợ tư vấn 24/7',
        'Nhận kết quả online'
      ]
    },
    {
      id: 2,
      title: 'Xét nghiệm ADN huyết thống',
      description: 'Xác định mối quan hệ huyết thống giữa các thành viên trong gia đình',
      price: '4.500.000 VNĐ',
      duration: '3-5 ngày',
      features: [
        'Xác định quan hệ huyết thống',
        'Kết quả được chấp nhận pháp lý',
        'Tư vấn chuyên sâu',
        'Bảo mật thông tin'
      ]
    },
    {
      id: 3,
      title: 'Xét nghiệm ADN hành chính',
      description: 'Xét nghiệm ADN được chấp nhận bởi các cơ quan nhà nước cho các thủ tục pháp lý',
      price: '5.500.000 VNĐ',
      duration: '3-5 ngày',
      features: [
        'Được chấp nhận pháp lý',
        'Hỗ trợ thủ tục hành chính',
        'Tư vấn pháp lý',
        'Bảo mật thông tin'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dịch vụ xét nghiệm ADN</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Chúng tôi cung cấp các dịch vụ xét nghiệm ADN chính xác, nhanh chóng và bảo mật
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h2>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                <span className="text-sm text-gray-500">Thời gian: {service.duration}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/appointment"
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Đặt lịch ngay
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quy trình xét nghiệm</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Đặt lịch</h3>
            <p className="text-gray-600">Đặt lịch hẹn qua website hoặc hotline</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Thu mẫu</h3>
            <p className="text-gray-600">Thu mẫu tại nhà hoặc trung tâm</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Phân tích</h3>
            <p className="text-gray-600">Phân tích mẫu trong phòng thí nghiệm</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">4</span>
            </div>
            <h3 className="font-semibold mb-2">Kết quả</h3>
            <p className="text-gray-600">Nhận kết quả online hoặc bản cứng</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 