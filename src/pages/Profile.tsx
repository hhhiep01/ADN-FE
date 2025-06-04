import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faLocationDot, 
  faFlask, 
  faCalendarCheck,
  faCheckCircle,
  faSpinner,
  faCamera,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
}

interface TestHistory {
  id: string;
  testType: string;
  date: string;
  status: string;
  result?: string;
  details?: {
    accuracy: string;
    conclusion: string;
    recommendations: string[];
  };
}

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTest, setSelectedTest] = useState<TestHistory | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    address: '123 Đường ABC, Quận XYZ, TP. HCM',
    avatar: ''
  });

  const [testHistory] = useState<TestHistory[]>([
    {
      id: 'ADN-2024-001',
      testType: 'Xét nghiệm ADN Cha - Con',
      date: '2024-02-20',
      status: 'Hoàn thành',
      result: '99.99% khả năng có quan hệ huyết thống',
      details: {
        accuracy: '99.99%',
        conclusion: 'Xác nhận có quan hệ huyết thống trực hệ',
        recommendations: [
          'Kết quả này có thể được sử dụng cho các thủ tục pháp lý',
          'Nên lưu trữ kết quả này cẩn thận',
          'Có thể sử dụng kết quả này cho các xét nghiệm ADN khác trong tương lai'
        ]
      }
    },
    {
      id: 'ADN-2024-002',
      testType: 'Xét nghiệm ADN Mẹ - Con',
      date: '2024-02-21',
      status: 'Đang xử lý'
    }
  ]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    console.log('Profile updated:', profile);
  };

  const toggleTest = (test: TestHistory) => {
    setSelectedTest(test);
  };

  const closeModal = () => {
    setSelectedTest(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">Thông tin cá nhân</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Image and Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div 
                  onClick={triggerFileInput}
                  className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                >
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="text-white text-6xl" />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">Click vào ảnh để thay đổi</p>
              <h2 className="text-xl font-semibold text-gray-800">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>

          {/* Middle Column - Profile Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cập nhật thông tin</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <Button label="Cập nhật thông tin" onClick={() => handleProfileUpdate} />
            </form>
          </div>

          {/* Right Column - Test History */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lịch sử xét nghiệm</h2>
            <div className="space-y-4">
              {testHistory.map((test) => (
                <div key={test.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div 
                    className="flex justify-between items-start cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => toggleTest(test)}
                  >
                    <div>
                      <h3 className="font-medium">{test.testType}</h3>
                      <p className="text-sm text-gray-600">Mã xét nghiệm: {test.id}</p>
                      <p className="text-sm text-gray-600">Ngày thực hiện: {test.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        test.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                        test.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {test.status}
                      </span>
                      <span className="text-gray-500">▶</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Test Details Modal */}
        {selectedTest && selectedTest.status === 'Hoàn thành' && selectedTest.details && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{selectedTest.testType}</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Kết quả</h4>
                    <p className="text-gray-700">{selectedTest.result}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Độ chính xác</h4>
                    <p className="text-gray-700">{selectedTest.details.accuracy}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Kết luận</h4>
                    <p className="text-gray-700">{selectedTest.details.conclusion}</p>
                  </div>

                  {selectedTest.details.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Khuyến nghị</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {selectedTest.details.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button label="Quay lại trang chủ" onClick={() => navigate('/')} />
        </div>
      </div>
    </div>
  );
};

export default Profile; 