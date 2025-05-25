import React from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">Trang Chủ</h1>
      <p className="text-lg text-red-600 mb-8">Chào mừng đến với dịch vụ xét nghiệm ADN huyết thống.</p>
      <Button label="Đặt Lịch" onClick={() => navigate('/booking')} />
      <div className="mt-4">
        <Button label="Hồ sơ của tôi" onClick={() => navigate('/profile')} />
      </div>
    </div>
  );
};

export default HomePage; 