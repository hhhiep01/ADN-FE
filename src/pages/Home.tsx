import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDna, FaFileAlt, FaHome, FaUser, FaPhone, FaEnvelope, FaCalendarCheck, FaFlask, FaUserCircle, FaVial, FaClipboardCheck, FaClipboardList, FaAward, FaMapMarkerAlt, FaUserCog } from 'react-icons/fa';
import { FaCheckCircle, FaClock, FaLock, FaHeadset } from 'react-icons/fa';

const Home = () => {
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = !!userRole;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null); // Khai báo kiểu cụ thể để tránh lỗi
  const [showSuccess, setShowSuccess] = useState(false);

  const initialCountdown = 14 * 60 * 60 + 2 * 60 + 34; // 14 giờ 2 phút 34 giây
  const [countdown, setCountdown] = useState(initialCountdown);
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);
  const hours = String(Math.floor(countdown / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((countdown % 3600) / 60)).padStart(2, '0');
  const seconds = String(countdown % 60).padStart(2, '0');

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData); // Lấy dữ liệu form
    try {
      await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      alert('Yêu cầu tư vấn đã được gửi!');
    } catch (error) {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
    setIsSubmitting(false);
  };

  const services = [
    {
      title: 'Xét nghiệm ADN dân sự',
      description: 'Xác định mối quan hệ huyết thống cho mục đích cá nhân với độ chính xác 99.99%',
      link: '/services',
      icon: <FaDna className="text-blue-600 w-10 h-10 mb-4 mx-auto" />,
      image: '/src/IMG/ADNdansu.png',
    },
    {
      title: 'Xét nghiệm ADN hành chính',
      description: 'Xác nhận quan hệ huyết thống cho các thủ tục pháp lý, được công nhận bởi cơ quan nhà nước',
      link: '/services',
      icon: <FaFileAlt className="text-blue-600 w-10 h-10 mb-4 mx-auto" />,
      image: '/src/IMG/ADNhanhchinh.png',
    },
    {
      title: 'Thu mẫu tại nhà',
      description: 'Dịch vụ thu mẫu tận nơi tiện lợi, đảm bảo quy trình vô trùng và chuyên nghiệp',
      link: '/services',
      icon: <FaHome className="text-blue-600 w-10 h-10 mb-4 mx-auto" />,
      image: '/src/IMG/ADNtainha.png',
    },
  ];

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

  const [deviceIndex, setDeviceIndex] = useState(0);
  const deviceImages = [1,2,3,4,5,6].map(i => `/src/IMG/tb${i}.png`);
  const showPerPage = 3;
  const canPrev = deviceIndex > 0;
  const canNext = deviceIndex + showPerPage < deviceImages.length;
  const handleDevicePrev = () => setDeviceIndex(i => Math.max(0, i - 1));
  const handleDeviceNext = () => setDeviceIndex(i => Math.min(deviceImages.length - showPerPage, i + 1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
{/* Hero Section */}
<motion.section
  variants={fadeIn}
  initial="hidden"
  animate="visible"
  className="relative text-center py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl shadow-2xl mb-16 overflow-hidden"
>
  {/* Background Pattern với hiệu ứng chuyển động */}
  <motion.div
    className="absolute inset-2 bg-[url('/src/IMG/helix.png')] opacity-15 bg-cover bg-center"
    animate={{
      x: [0, -100],
      opacity: [0.15, 0.1, 0.15],
      transition: { repeat: Infinity, duration: 15, ease: "linear" },
    }}
  />
  

  <h1
    className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300"
    style={{ textShadow: "0 2px 10px rgba(255, 165, 0, 0.3)" }}
  >
    Xét nghiệm ADN huyết thống
  </h1>
  <p
    className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 font-light leading-relaxed"
    style={{ textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)" }}
  >
    Khám phá mối quan hệ huyết thống với công nghệ tiên tiến, kết quả chính xác 99.99% và bảo mật tuyệt đối
  </p>
  <Link
    to={isLoggedIn ? '/appointment' : '/customer/login'}
    className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white px-10 py-4 text-lg rounded-2xl font-semibold shadow-lg transform transition-all duration-300"
  >
    <motion.span
      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(251, 191, 36, 0.5)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="block"
    >
      {isLoggedIn ? 'Đặt lịch ngay' : 'Đăng nhập để đặt lịch'}
    </motion.span>
  </Link>
</motion.section>


{/* About Us */}

<motion.section
  variants={fadeIn}
  initial="hidden"
  animate="visible"
  className="bg-gradient-to-br from-white to-blue-100 p-12 rounded-3xl shadow-lg mb-16"
>
  <h2
    className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-8 text-center"
    style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}
  >
    Về chúng tôi
  </h2>
  <div className="flex flex-col md:flex-row items-center gap-12">
    <motion.img
      src="/src/IMG/laborato.png" 
      alt="Laboratory"
      className="w-full md:w-1/2 rounded-2xl shadow-md"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0, transition: { duration: 0.8 } }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)" }}
      whileTap={{ scale: 0.98 }}
      loading="lazy"
    />
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } }}
    >
      <p className="text-gray-600 font-light text-lg leading-relaxed mb-6 hover:text-gray-800 transition-colors duration-300">
        Với hơn 10 năm kinh nghiệm, chúng tôi là đơn vị xét nghiệm ADN hàng đầu, được chứng nhận ISO 9001 và hợp tác với các phòng thí nghiệm quốc tế uy tín.
      </p>
      <div className="flex justify-center gap-8">
        <motion.img
          src="/src/IMG/iso.png" 
          alt="ISO Certified"
          className="h-24 rounded-lg border-2 border-transparent bg-gradient-to-r from-blue-500 to-indigo-500 p-1"
          loading="lazy"
          whileHover={{ scale: 1.15, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <motion.img
          src="/src/IMG/labparner.png" 
          alt="Lab Partner"
          className="h-24 rounded-lg border-2 border-transparent bg-gradient-to-r from-blue-500 to-indigo-500 p-1"
          loading="lazy"
          whileHover={{ scale: 1.15, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </div>
    </motion.div>
  </div>
</motion.section>



      {/* Services Overview */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            variants={fadeIn}
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <img src={service.image} alt={service.title} className="w-full h-40 object-cover rounded-2xl mb-4" loading="lazy" />
            {service.icon}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h2>
            <p className="text-gray-600 mb-6 leading-relaxed font-light">{service.description}</p>
            <Link
              to={service.link}
              className="text-yellow-600 font-semibold hover:text-yellow-700 transition-colors duration-200"
            >
              Tìm hiểu thêm →
            </Link>
          </motion.div>
        ))}
      </motion.section>

      
{/* Why Choose Us */}
<motion.section
  variants={fadeIn}
  initial="hidden"
  animate="visible"
  className="bg-gradient-to-br from-blue-50 to-indigo-50 p-10 rounded-2xl shadow-xl mb-16"
>
  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10 text-center">Tại sao chọn chúng tôi?</h2>
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10"
  >
    {[
      { value: '99.99%', label: 'Độ chính xác', icon: 'FaCheckCircle' },
      { value: '3-5 ngày', label: 'Thời gian có kết quả', icon: 'FaClock' },
      { value: '100%', label: 'Bảo mật thông tin', icon: 'FaLock' },
      { value: '24/7', label: 'Hỗ trợ khách hàng', icon: 'FaHeadset' },
    ].map((item, index) => (
      <motion.div
        key={index}
        variants={fadeIn}
        whileHover={{ scale: 1.05, boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }} // Hiệu ứng glow khi hover
        whileTap={{ scale: 0.98 }} // Hiệu ứng khi nhấn
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="text-center p-6 bg-white rounded-2xl shadow-md hover:bg-blue-50 transition-all duration-300"
      >
        <div className="flex justify-center mb-4">
          {item.icon === 'FaCheckCircle' && <FaCheckCircle className="text-green-500 w-8 h-8" />}
          {item.icon === 'FaClock' && <FaClock className="text-yellow-500 w-8 h-8" />}
          {item.icon === 'FaLock' && <FaLock className="text-blue-500 w-8 h-8" />}
          {item.icon === 'FaHeadset' && <FaHeadset className="text-purple-500 w-8 h-8" />}
        </div>
        <div className="text-4xl font-extrabold text-blue-600 mb-3">{item.value}</div>
        <p className="text-gray-700 font-medium">{item.label}</p>
      </motion.div>
    ))}
  </motion.div>
</motion.section>


{/* Customer Testimonials */}
<motion.section
  variants={fadeIn}
  initial="hidden"
  animate="visible"
  className="bg-gradient-to-br from-white to-blue-50 p-10 rounded-3xl shadow-lg mb-16"
>
  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">Khách hàng nói gì về chúng tôi</h2>
  <p className="text-gray-600 text-center mb-10 text-lg font-light">Hơn 10,000 khách hàng đã tin tưởng dịch vụ của chúng tôi</p>
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
    }}
    initial="hidden"
    animate="visible"
  >
    {testimonials.map((testimonial, index) => (
      <motion.div
        key={index}
        variants={fadeIn}
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
  </motion.div>
</motion.section>


      
{/* FAQ Section */}
<motion.section
  variants={fadeIn}
  initial="hidden"
  animate="visible"
  className="bg-gradient-to-br from-blue-50 to-indigo-50 p-10 rounded-2xl shadow-xl mb-16"
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




{/* Đăng ký xét nghiệm ADN & Đăng ký tư vấn */}


{/* Section Quy trình xét nghiệm */}
<div className="bg-blue-50 py-16">
  <div className="max-w-5xl mx-auto px-4">
    <div className="text-center mb-6">
      <div className="text-pink-600 font-bold uppercase tracking-widest text-sm">QUY TRÌNH</div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Thực Hiện Xét Nghiệm ADN</h2>
      <p className="text-gray-700 max-w-3xl mx-auto text-base md:text-lg">
        Chúng tôi luôn đảm bảo tính chính xác và đáng tin cậy của kết quả xét nghiệm ADN bằng cách sử dụng các phương pháp và tiêu chuẩn chất lượng cao nhất.<br />
        Chúng tôi đảm bảo tính bảo mật, riêng tư của thông tin cá nhân và cam kết không chia sẻ thông tin này với bất kỳ bên thứ ba nào.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center mt-10">
      <div>
        <div className="mx-auto mb-4 w-24 h-24 flex items-center justify-center rounded-full bg-blue-700 shadow-lg">
          <FaUserCircle className="text-white text-5xl" />
        </div>
        <div className="font-bold text-lg mb-1">Tư vấn</div>
      </div>
      <div>
        <div className="mx-auto mb-4 w-24 h-24 flex items-center justify-center rounded-full bg-blue-700 shadow-lg">
          <FaVial className="text-white text-5xl" />
        </div>
        <div className="font-bold text-lg mb-1">Thu mẫu</div>
      </div>
      <div>
        <div className="mx-auto mb-4 w-24 h-24 flex items-center justify-center rounded-full bg-blue-700 shadow-lg">
          <FaFlask className="text-white text-5xl" />
        </div>
        <div className="font-bold text-lg mb-1">Phân tích</div>
      </div>
      <div>
        <div className="mx-auto mb-4 w-24 h-24 flex items-center justify-center rounded-full bg-blue-700 shadow-lg">
          <FaClipboardCheck className="text-white text-5xl" />
        </div>
        <div className="font-bold text-lg mb-1">Trả kết quả</div>
      </div>
    </div>
  </div>
</div>

{/* Section Cơ sở vật chất – Trang thiết bị */}
<div className="bg-blue-50 py-16">
  <div className="max-w-6xl mx-auto px-4">
    <div className="text-center mb-8">
      <div className="text-pink-600 font-bold uppercase tracking-widest text-sm mb-1">CƠ SỞ VẬT CHẤT</div>
      <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">TRANG THIẾT BỊ</h2>
    </div>
    <div className="mb-10 relative flex items-center justify-center">
      <button
        type="button"
        aria-label="Trước"
        onClick={handleDevicePrev}
        disabled={!canPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-300 shadow rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-100 transition disabled:opacity-30"
        style={{transform: 'translateY(-50%)'}}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className="flex gap-6 w-full max-w-4xl mx-auto overflow-hidden">
        {deviceImages.slice(deviceIndex, deviceIndex + showPerPage).map((src, i) => (
          <img
            key={i + deviceIndex}
            src={src}
            alt={`Thiết bị ${i + 1 + deviceIndex}`}
            className="rounded-xl object-cover w-72 h-56 flex-shrink-0 shadow-lg transition-transform duration-300 hover:scale-105 mx-auto"
          />
        ))}
      </div>
      <button
        type="button"
        aria-label="Sau"
        onClick={handleDeviceNext}
        disabled={!canNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-300 shadow rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-100 transition disabled:opacity-30"
        style={{transform: 'translateY(-50%)'}}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center mt-8">
      <div>
        <div className="mx-auto mb-3 w-16 h-16 flex items-center justify-center rounded-full bg-white border-2 border-blue-400 shadow">
          <FaClipboardList className="text-blue-600 text-3xl" />
        </div>
        <div className="font-bold text-base text-blue-700 mb-1 uppercase">Đặt lịch dễ dàng</div>
        <div className="text-gray-700 text-sm">Đặt lịch hẹn xét nghiệm dễ dàng chỉ với chiếc điện thoại trên tay, chúng tôi có hỗ trợ thu mẫu tại nhà hoặc nơi bạn tự chỉ định.</div>
      </div>
      <div>
        <div className="mx-auto mb-3 w-16 h-16 flex items-center justify-center rounded-full bg-white border-2 border-blue-400 shadow">
          <FaAward className="text-blue-600 text-3xl" />
        </div>
        <div className="font-bold text-base text-blue-700 mb-1 uppercase">Chuẩn ISO</div>
        <div className="text-gray-700 text-sm">Luôn đi đầu trong việc đầu tư hệ thống trang thiết bị hiện đại bậc nhất thế giới như: <i>NGS, GeneMapper IDX, Array,...</i></div>
      </div>
      <div>
        <div className="mx-auto mb-3 w-16 h-16 flex items-center justify-center rounded-full bg-white border-2 border-blue-400 shadow">
          <FaMapMarkerAlt className="text-blue-600 text-3xl" />
        </div>
        <div className="font-bold text-base text-blue-700 mb-1 uppercase">Vị trí</div>
        <div className="text-gray-700 text-sm">Tọa lạc tại trung tâm các thành phố lớn như <b>Hà Nội, Sài Gòn, Nha Trang, Vũng Tàu,...</b> giúp khách hàng dễ dàng tiếp cận.</div>
      </div>
      <div>
        <div className="mx-auto mb-3 w-16 h-16 flex items-center justify-center rounded-full bg-white border-2 border-blue-400 shadow">
          <FaUserCog className="text-blue-600 text-3xl" />
        </div>
        <div className="font-bold text-base text-blue-700 mb-1 uppercase">Chủ động</div>
        <div className="text-gray-700 text-sm">Văn phòng chi nhánh và đội ngũ nhân sự chất lượng, đông đảo, có trình độ chuyên môn cao tại 63 tỉnh thành khắp cả nước.</div>
      </div>
    </div>
  </div>
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
export default Home;
