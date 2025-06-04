import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

interface TestResult {
  id: string;
  testType: string;
  date: string;
  status: string;
  result: string;
  details: {
    accuracy: string;
    conclusion: string;
    recommendations: string[];
  };
}

const Results = () => {
  const navigate = useNavigate();
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [results] = useState<TestResult[]>([
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
      status: 'Đang xử lý',
      result: 'Đang phân tích',
      details: {
        accuracy: 'Chưa có kết quả',
        conclusion: 'Đang trong quá trình phân tích',
        recommendations: []
      }
    }
  ]);

  const toggleResult = (test: TestResult) => {
    setSelectedResult(test);
  };

  const closeModal = () => {
    setSelectedResult(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">Kết quả xét nghiệm</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mb-8">
        <div className="space-y-6">
          {results.map((test) => (
            <div key={test.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div 
                className="flex justify-between items-start mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => toggleResult(test)}
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{test.testType}</h3>
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

      {/* Test Details Modal */}
      {selectedResult && selectedResult.status === 'Hoàn thành' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{selectedResult.testType}</h3>
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
                  <p className="text-gray-700">{selectedResult.result}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Độ chính xác</h4>
                  <p className="text-gray-700">{selectedResult.details.accuracy}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Kết luận</h4>
                  <p className="text-gray-700">{selectedResult.details.conclusion}</p>
                </div>

                {selectedResult.details.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Khuyến nghị</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {selectedResult.details.recommendations.map((rec, index) => (
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

      <div className="flex gap-4">
        <Button label="Quay lại trang chủ" onClick={() => navigate('/')} />
        <Button label="Xem hồ sơ" onClick={() => navigate('/profile')} />
      </div>
    </div>
  );
};

export default Results; 