import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, 
  faHouseUser, 
  faFlask, 
  faFileAlt,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { useGetAllServices, type Service } from "../Services/ServiceService/GetAllServices";

const Services = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetAllServices();
  const services: Service[] = data?.result || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const cardsPerPage = 3;
  const canPrev = currentIndex > 0;
  const canNext = currentIndex + cardsPerPage < services.length;

  const handlePrev = () => {
    if (canPrev) setCurrentIndex(currentIndex - 1);
  };
  const handleNext = () => {
    if (canNext) setCurrentIndex(currentIndex + 1);
  };

  const handleBookAppointment = (service: Service) => {
    navigate('/appointment', { 
      state: { 
        selectedService: service 
      } 
    });
  };

  const testimonials = [
    { name: 'Mr.Lyu Hong Seng ', text: 'Dịch vụ rất chuyên nghiệp, kết quả nhanh chóng chỉ sau 3 ngày!', avatar: '/src/IMG/Lyu-Hong-Seng.png' },
    { name: 'Mr.LEO', text: 'Nhân viên tư vấn tận tình, giải đáp mọi thắc mắc của tôi.', avatar: '/src/IMG/LEO.png' },
    { name: 'Mr.Nghiêm Xuân Đức ', text: 'Tôi rất hài lòng với sự bảo mật và độ tin cậy của trung tâm.', avatar: '/src/IMG/Mr.NXD.png' },
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (isLoading) return <div className="text-center py-20">Đang tải dịch vụ...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">Lỗi: {error?.message || "Không thể tải dịch vụ"}</div>;

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
        <div className="relative mb-20">
          <div className="overflow-hidden w-full">
            <motion.div
              className="flex"
              style={{ width: `${services.length * (100 / cardsPerPage)}%` }}
              animate={{ x: `-${(100 / services.length) * currentIndex}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {services.map((service) => (
                <div
                  key={service.id}
                  className="w-full md:w-1/3 flex-shrink-0 px-2"
                  style={{ minWidth: 0 }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -10,
                      transition: {
                        duration: 0.2,
                        ease: "easeOut"
                      }
                    }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl flex flex-col h-full"
                  >
                    <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                      <img 
                        src={service.image || "/images/adn-test1.jpg"} 
                        alt={service.name}
                        className="w-full h-56 object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=DNA+Testing';
                        }}
                      />
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">{service.name}</h2>
                      </div>
                      <p className="text-gray-600 mb-8 leading-relaxed flex-1">{service.description}</p>
                      <div className="mb-8">
                        <span className="text-3xl font-bold text-blue-600">{service.price?.toLocaleString()} đ</span>
                      </div>
                      <div className="mt-auto">
                        <button
                          onClick={() => handleBookAppointment(service)}
                          className="block w-full text-center bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 text-lg hover:shadow-lg transform hover:-translate-y-1"
                        >
                          Đặt lịch ngay
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
          {services.length > cardsPerPage && (
            <>
              <button
                onClick={handlePrev}
                disabled={!canPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-300 shadow rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-100 transition disabled:opacity-30"
                style={{transform: 'translateY(-50%)'}}
                aria-label="Trước"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button
                onClick={handleNext}
                disabled={!canNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-300 shadow rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-100 transition disabled:opacity-30"
                style={{transform: 'translateY(-50%)'}}
                aria-label="Sau"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </>
          )}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 shadow-sm"
                  loading="lazy"
                />
                <p className="text-gray-700 italic mb-4 text-center">"{testimonial.text}"</p>
                <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-right">
                  - {testimonial.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <motion.section
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-blue-50 to-indigo-50 p-10 rounded-2xl shadow-xl mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">Câu hỏi thường gặp</h2>
          
          {/* Expand/Collapse All Button */}
          <div className="flex justify-center mb-6">
            <motion.button
              onClick={() => {
                if (activeFaq === null) {
                  // If none are open, open the first one
                  setActiveFaq(0);
                } else {
                  // If any are open, close all
                  setActiveFaq(null);
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${activeFaq !== null ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
              {activeFaq === null ? 'Mở tất cả' : 'Đóng tất cả'}
            </motion.button>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index} 
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.button
                  onClick={() => {
                    setActiveFaq(activeFaq === index ? null : index);
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    backgroundColor: '#f8fafc',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-6 bg-white rounded-2xl transition-all duration-300 text-lg font-semibold text-gray-700 flex justify-between items-center gap-4 border-2 ${
                    activeFaq === index 
                      ? 'border-blue-500 shadow-lg' 
                      : 'border-transparent hover:border-blue-200'
                  }`}
                >
                  <span className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      activeFaq === index 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-left">{faq.question}</span>
                  </span>
                  <motion.span 
                    className="text-2xl font-bold text-blue-500 transition-all duration-300"
                    animate={{ 
                      rotate: activeFaq === index ? 180 : 0,
                      color: activeFaq === index ? '#3b82f6' : '#6b7280'
                    }}
                  >
                    ▼
                  </motion.span>
                </motion.button>
                
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -10 }}
                      animate={{ height: 'auto', opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -10 }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 100, 
                        damping: 20, 
                        duration: 0.3 
                      }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 text-gray-600 font-light bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-inner mt-2 border-l-4 border-blue-500">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          {/* FAQ Summary */}
          <div className="text-center mt-8 pt-6 border-t border-blue-200">
            <p className="text-gray-600 text-sm">
              Không tìm thấy câu trả lời? 
              <button className="text-blue-600 hover:text-blue-700 font-medium ml-1 underline">
                Liên hệ với chúng tôi
              </button>
            </p>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="bg-[#f5f6fa] border-t mt-16 pt-10 pb-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800">
          <div>
            <div className="font-bold mb-2">Công ty Cổ phần ADN Testing</div>
            <div className="text-sm mb-1">
              Lô B4/D21, Khu đô thị mới Cầu Giấy, Phường Dịch Vọng Hậu, Quận Cầu
              Giấy, Hà Nội
            </div>
            <div className="text-sm mb-1">
              ĐKKD số. 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/2015
            </div>
            <div className="text-sm mb-1">024-7301-2468 (7h - 18h)</div>
            <div className="text-sm mb-1">support@adntesting.vn (7h - 18h)</div>
            <div className="text-sm mb-1">
              Văn phòng tại TP Hồ Chí Minh: Tòa nhà H3, 384 Hoàng Diệu, Phường
              6, Quận 4, TP.HCM
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
    </div>
  );
};

export default Services; 