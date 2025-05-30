import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaClock, FaNotesMedical, FaFlask, FaArrowRight } from 'react-icons/fa';

const Appointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '', // 'civil' or 'administrative'
    testType: '',
    sampleCollectionMethod: '', // 'self' or 'facility'
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  const showAppointmentFields = formData.serviceType === 'administrative' || formData.sampleCollectionMethod === 'facility';

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Đặt lịch xét nghiệm ADN
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Điền thông tin bên dưới để đặt lịch xét nghiệm ADN. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 bg-blue-600">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-2"><FaFlask /></span>
              Thông tin đặt lịch
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 group">
                <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
                  <span className="mr-2 text-blue-600"><FaUser /></span>
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
              <div className="space-y-2 group">
                <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                  <span className="mr-2 text-blue-600"><FaEnvelope /></span>
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
                <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700">
                  <span className="mr-2 text-blue-600"><FaPhone /></span>
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>
              <div className="space-y-2 group">
                <label htmlFor="serviceType" className="flex items-center text-sm font-medium text-gray-700">
                  <span className="mr-2 text-blue-600"><FaFlask /></span>
                  Loại dịch vụ
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Chọn loại dịch vụ</option>
                  <option value="civil">Xét nghiệm ADN dân sự</option>
                  <option value="administrative">Xét nghiệm ADN hành chính</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 group">
                <label htmlFor="testType" className="flex items-center text-sm font-medium text-gray-700">
                  <span className="mr-2 text-blue-600"><FaFlask /></span>
                  Loại xét nghiệm
                </label>
                <select
                  id="testType"
                  name="testType"
                  value={formData.testType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Chọn loại xét nghiệm</option>
                  <option value="father-son">Xét nghiệm ADN cha con</option>
                  <option value="mother-son">Xét nghiệm ADN mẹ con</option>
                  <option value="siblings">Xét nghiệm ADN anh chị em</option>
                  <option value="grandparents">Xét nghiệm ADN ông bà - cháu</option>
                </select>
              </div>
              {formData.serviceType === 'civil' && (
                <div className="space-y-2 group">
                  <label htmlFor="sampleCollectionMethod" className="flex items-center text-sm font-medium text-gray-700">
                    <span className="mr-2 text-blue-600"><FaFlask /></span>
                    Phương thức thu mẫu
                  </label>
                  <select
                    id="sampleCollectionMethod"
                    name="sampleCollectionMethod"
                    value={formData.sampleCollectionMethod}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Chọn phương thức thu mẫu</option>
                    <option value="self">Tự thu mẫu tại nhà</option>
                    <option value="facility">Yêu cầu cơ sở thu mẫu</option>
                  </select>
                </div>
              )}
            </div>

            {showAppointmentFields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label htmlFor="appointmentDate" className="flex items-center text-sm font-medium text-gray-700">
                    <span className="mr-2 text-blue-600"><FaCalendarAlt /></span>
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
                  />
                </div>
                <div className="space-y-2 group">
                  <label htmlFor="appointmentTime" className="flex items-center text-sm font-medium text-gray-700">
                    <span className="mr-2 text-blue-600"><FaClock /></span>
                    Giờ hẹn
                  </label>
                  <input
                    type="time"
                    id="appointmentTime"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 group">
              <label htmlFor="notes" className="flex items-center text-sm font-medium text-gray-700">
                <span className="mr-2 text-blue-600"><FaNotesMedical /></span>
                Ghi chú thêm
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Nhập thông tin bổ sung nếu cần..."
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
              >
                Đặt lịch ngay
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