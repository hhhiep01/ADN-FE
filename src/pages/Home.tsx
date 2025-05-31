
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDna, FaFileAlt, FaHome, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import { FaCheckCircle, FaClock, FaLock, FaHeadset } from 'react-icons/fa';




const Home = () => {
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = !!userRole;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null); // Khai báo kiểu cụ thể để tránh lỗi

  

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
  { question: 'Xét nghiệm ADN mất bao lâu?', answer: 'Thông thường từ 3-5 ngày làm việc.' },
  { question: 'Kết quả có được công nhận pháp lý không?', answer: 'Có, xét nghiệm ADN hành chính của chúng tôi được các cơ quan nhà nước công nhận.' },
  { question: 'Tôi cần chuẩn bị gì trước khi xét nghiệm?', answer: 'Chỉ cần cung cấp mẫu tóc, móng tay hoặc máu. Chúng tôi sẽ hướng dẫn chi tiết.' },
  { question: 'Chi phí xét nghiệm ADN là bao nhiêu?', answer: 'Chi phí phụ thuộc vào loại xét nghiệm (dân sự hoặc hành chính). Vui lòng liên hệ để được báo giá chi tiết.' },
  { question: 'Xét nghiệm ADN có an toàn và bảo mật không?', answer: 'Hoàn toàn an toàn và bảo mật. Chúng tôi tuân thủ các quy định nghiêm ngặt về bảo vệ dữ liệu cá nhân.' },
  { question: 'Có thể xét nghiệm ADN cho trẻ sơ sinh không?', answer: 'Có, chúng tôi hỗ trợ xét nghiệm cho trẻ sơ sinh với quy trình nhẹ nhàng và an toàn.' },
  { question: 'Thời gian thu mẫu tại nhà là bao lâu?', answer: 'Nhân viên sẽ thu mẫu trong vòng 1-2 giờ sau khi bạn đặt lịch, tùy khu vực.' },
  { question: 'Kết quả xét nghiệm có được gửi qua email không?', answer: 'Có, bạn có thể chọn nhận kết quả qua email hoặc trực tiếp tại trung tâm.' },
];



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
  <div className="max-w-2xl mx-auto">
    {faqs.map((faq, index) => (
      <div key={index} className="mb-6">
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            setActiveFaq(activeFaq === index ? null : index);
          }}
          whileHover={{ scale: 1.02, backgroundColor: '#f3f4f6' }} // Hiệu ứng hover mượt mà
          whileTap={{ scale: 0.98 }} // Hiệu ứng khi nhấn
          className="w-full text-left p-5 bg-white rounded-2xl hover:shadow-md transition-all duration-200 text-lg font-semibold text-gray-700 flex justify-between items-center gap-4"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
            {faq.question}
          </span>
          <span className="text-xl transition-transform duration-200" style={{ transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            {activeFaq === index ? '−' : '+'}
          </span>
        </motion.button>
        {activeFaq === index && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.4 }}
            className="p-5 text-gray-600 font-light bg-gray-50 rounded-2xl shadow-inner mt-2"
          >
            {faq.answer}
          </motion.div>
        )}
      </div>
    ))}
  </div>
</motion.section>




{/* Contact Form */}
<motion.section
  variants={fadeIn}
  initial="hidden"
  animate="visible"
  className="bg-gradient-to-br from-white to-blue-100 p-10 rounded-2xl shadow-xl"
>
  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">Liên hệ tư vấn</h2>
  <motion.form
    onSubmit={handleSubmit}
    className="max-w-lg mx-auto space-y-6"
  >
    <div className="flex flex-col space-y-2">
      <label htmlFor="name" className="text-gray-700">Họ và tên</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div className="flex flex-col space-y-2">
      <label htmlFor="phone" className="text-gray-700">Số điện Thoại</label>
      <input
        type="phone"
        id="phone"
        name="phone"
        required
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div className="flex flex-col space-y-2">
      <label htmlFor="message" className="text-gray-700">Nội dung</label>
      <textarea
        id="message"
        name="message"
        required
        rows={4}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>
    <motion.button
      type="submit"
      disabled={isSubmitting}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Đang gửi...
        </>
      ) : (
        'Gửi yêu cầu tư vấn'
      )}
    </motion.button>
  </motion.form>
</motion.section>


      


    </div>
  );
};
export default Home;
