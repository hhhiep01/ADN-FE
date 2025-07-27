import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../Services/AuthService/LoginService';
import { decodeJWT } from '../utils/jwtUtils';
import type { ResponseModel } from '../model/responseModel';
import { useMutation } from '@tanstack/react-query';

const StaffLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { mutate: loginMutate, isPending, isError, error, isSuccess, data } = useMutation({
    mutationFn: login
  });

  // Handle success
  useEffect(() => {
    if (isSuccess && data && data.isSuccess && data.result) {
      // Save JWT token
      const token = data.result;
      localStorage.setItem('token', token);
      
      // Decode JWT to get user information
      const userInfo = decodeJWT(token);
      
      if (userInfo) {
        // Check if user is staff or admin
        if (userInfo.role.toLowerCase() !== 'staff' && userInfo.role.toLowerCase() !== 'admin') {
          // Clear token and show error
          localStorage.removeItem('token');
          setFormData({ email: '', password: '' });
          return;
        }

        localStorage.setItem('userRole', userInfo.role);
        localStorage.setItem('user', JSON.stringify({
          userId: userInfo.userId,
          email: userInfo.email,
          role: userInfo.role,
          fullName: userInfo.fullName
        }));
        
        // Small delay to ensure localStorage is updated
        setTimeout(() => {
          navigate('/staff/appointments');
        }, 100);
      }
    }
  }, [isSuccess, data, navigate]);

  // Hàm xử lý đăng nhập nhân viên
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    loginMutate({
      email: formData.email,
      password: formData.password
    });
  };

  // Parse error message
  const getErrorMessage = () => {
    if (!isError || !error) return '';

    const errorMessage = error.message;
    
    if (errorMessage.includes('Error: ') && errorMessage.includes(' - ')) {
      try {
        const responsePart = errorMessage.split(' - ')[1];
        const responseData: ResponseModel = JSON.parse(responsePart);
        
        if (responseData?.errorMessage) {
          return responseData.errorMessage;
        }
      } catch (parseError) {
        return 'Email hoặc mật khẩu không hợp lệ';
      }
    }
    
    return errorMessage;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ADN Testing</h1>
          <p className="text-gray-600 mb-8">Hệ thống quản lý nhân viên</p>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập hệ thống nhân viên
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Chỉ dành cho nhân viên
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {location.state?.message && (
            <div className={`mb-4 p-4 rounded-md ${location.state.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {location.state.message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{getErrorMessage()}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Nhập địa chỉ email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Chưa có tài khoản?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/staff/register"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Đăng ký tài khoản mới
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/admin/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Đăng nhập với tư cách quản trị viên
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-green-600 mb-2">
              <svg className="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Quản lý lịch hẹn</h3>
            <p className="text-xs text-gray-500 mt-1">Xem và xử lý lịch hẹn</p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-blue-600 mb-2">
              <svg className="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Báo cáo kết quả</h3>
            <p className="text-xs text-gray-500 mt-1">Cập nhật kết quả xét nghiệm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin; 