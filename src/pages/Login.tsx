import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserRole } from '../types/auth';

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const handleLogin = () => {
    // Lưu role vào localStorage để test
    localStorage.setItem('userRole', selectedRole);
    // Chuyển hướng dựa vào role
    switch (selectedRole) {
      case 'admin':
        navigate('/admin/users');
        break;
      case 'staff':
        navigate('/staff/appointments');
        break;
      case 'customer':
        navigate('/results');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập hệ thống
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Chọn vai trò để test hệ thống
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Chọn vai trò
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <div>
            <button
              onClick={handleLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 