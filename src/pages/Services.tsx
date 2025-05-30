import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, 
  faHouseUser, 
  faFlask, 
  faFileAlt,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Xét nghiệm ADN cha con',
      description: 'Xác định mối quan hệ huyết thống giữa cha và con với độ chính xác 99.99%',
      price: '3.500.000 VNĐ',
      duration: '3-5 ngày',
      image: '/images/adn-test1.jpg',
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
      image: '/images/adn-test2.jpg',
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
      image: '/images/adn-test3.jpg',
      features: [
        'Được chấp nhận pháp lý',
        'Hỗ trợ thủ tục hành chính',
        'Tư vấn pháp lý',
        'Bảo mật thông tin'
      ]
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      role: 'Khách hàng',
      content: 'Dịch vụ rất chuyên nghiệp, kết quả chính xác và nhanh chóng. Tôi rất hài lòng!',
      color: 'rgb(59, 130, 246)' // text-blue-500
    },
    {
      id: 2,
      name: 'Trần Thị B',
      role: 'Khách hàng',
      content: 'Nhân viên tư vấn nhiệt tình, quy trình làm việc rõ ràng, đảm bảo tính bảo mật.',
      color: 'rgb(16, 185, 129)' // text-green-500
    }
  ];

  const faqs = [
    {
      question: 'Quy trình xét nghiệm ADN diễn ra như thế nào?',
      answer: 'Quy trình xét nghiệm ADN bao gồm 4 bước chính: đặt lịch, lấy mẫu, phân tích trong phòng thí nghiệm và trả kết quả.'
    },
    {
      question: 'Thời gian nhận kết quả xét nghiệm là bao lâu?',
      answer: 'Thông thường, thời gian nhận kết quả từ 3-5 ngày làm việc kể từ khi lấy mẫu.'
    },
    {
      question: 'Kết quả xét nghiệm có được bảo mật không?',
      answer: 'Chúng tôi cam kết bảo mật 100% thông tin và kết quả xét nghiệm của khách hàng.'
    }
  ];

  const processSteps = [
    { 
      icon: faCalendarCheck,
      title: 'Đặt lịch', 
      desc: 'Đặt lịch hẹn qua website hoặc hotline',
      color: 'rgb(59, 130, 246)' // text-blue-500
    },
    { 
      icon: faHouseUser,
      title: 'Thu mẫu', 
      desc: 'Thu mẫu tại nhà hoặc trung tâm',
      color: 'rgb(16, 185, 129)' // text-green-500
    },
    { 
      icon: faFlask,
      title: 'Phân tích', 
      desc: 'Phân tích mẫu trong phòng thí nghiệm',
      color: 'rgb(245, 158, 11)' // text-amber-500
    },
    { 
      icon: faFileAlt,
      title: 'Kết quả', 
      desc: 'Nhận kết quả online hoặc bản cứng',
      color: 'rgb(99, 102, 241)' // text-indigo-500
    }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Banner */}
      <div 
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/images/ADN-banner.png")',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white text-center px-4"
          >
            DỊCH VỤ XÉT NGHIỆM ADN
          </motion.h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Chúng tôi cung cấp các dịch vụ xét nghiệm ADN chính xác, nhanh chóng và bảo mật
            với công nghệ hiện đại nhất và đội ngũ chuyên gia giàu kinh nghiệm
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: {
                  duration: 0.2,
                  ease: "easeOut"
                }
              }}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
            >
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-56 object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=DNA+Testing';
                  }}
                />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">{service.title}</h2>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {service.duration}
                  </span>
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">{service.description}</p>
                <div className="mb-8">
                  <span className="text-3xl font-bold text-blue-600">{service.price}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="w-6 h-6 mr-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/appointment"
                  className="block w-full text-center bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 text-lg hover:shadow-lg transform hover:-translate-y-1"
                >
                  Đặt lịch ngay
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-gray-50 py-20 px-4 lg:px-8 rounded-2xl mb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Quy trình xét nghiệm</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center group"
                >
                  <div 
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ color: step.color }}
                  >
                    <FontAwesomeIcon 
                      icon={step.icon} 
                      className="text-3xl"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gradient-to-br from-blue-50 to-white py-20 px-4 lg:px-8 rounded-2xl mb-20">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-20"
            >
              <span className="text-blue-900">Tại sao nên chọn </span>
              <span className="text-orange-500">ADN Testing</span>
              <span className="text-blue-900"> ?</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-center">
              {/* Left Benefits */}
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-end space-x-4"
                >
                  <div className="text-right">
                    <h3 className="font-semibold mb-2">Trả kết quả chỉ từ 4h</h3>
                    <p className="text-gray-600 text-sm">Quy trình xét nghiệm nhanh chóng</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-end space-x-4"
                >
                  <div className="text-right">
                    <h3 className="font-semibold mb-2">Thu mẫu tại nhà toàn quốc</h3>
                    <p className="text-gray-600 text-sm">Phục vụ tận nơi, tiện lợi</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-end space-x-4"
                >
                  <div className="text-right">
                    <h3 className="font-semibold mb-2">Kết quả pháp lý có giá trị</h3>
                    <p className="text-gray-600 text-sm">Được tòa án chấp nhận toàn quốc</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </motion.div>
              </div>

              {/* Center DNA Image */}
              <div className="relative flex justify-center py-8">
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  src="/images/chose-adn.jpg"
                  alt="DNA Structure"
                  className="w-full max-w-[350px] rounded-lg shadow-xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/350x600?text=DNA+Structure';
                  }}
                />
              </div>

              {/* Right Benefits */}
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Phòng lab đạt chuẩn quốc tế</h3>
                    <p className="text-gray-600 text-sm">Trang thiết bị hiện đại</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Dịch vụ chuyên nghiệp</h3>
                    <p className="text-gray-600 text-sm">Tư vấn tận tình, chu đáo</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Bảo mật thông tin</h3>
                    <p className="text-gray-600 text-sm">Cam kết bảo mật tuyệt đối</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Khách hàng nói gì về chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
                    style={{ color: testimonial.color }}
                  >
                    <FontAwesomeIcon icon={faUserCircle} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Câu hỏi thường gặp</h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 