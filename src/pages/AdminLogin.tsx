import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../Services/AuthService/LoginService';
import type { ResponseModel } from '../model/responseModel';
import { decodeJWT } from '../utils/jwtUtils';

const AdminLogin = () => {
  const navigate = useNavigate();
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
        localStorage.setItem('userRole', userInfo.role);
        localStorage.setItem('user', JSON.stringify({
          userId: userInfo.userId,
          email: userInfo.email,
          role: userInfo.role,
          fullName: userInfo.fullName
        }));
      }
      
      // Small delay to ensure localStorage is updated
      setTimeout(() => {
        navigate('/admin/users');
      }, 100);
    }
  }, [isSuccess, data, navigate]);

  // Hàm xử lý đăng nhập admin
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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập quản trị
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Dành cho quản trị viên và nhân viên
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {isError && (
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/admin/register"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Đăng ký tài khoản quản trị
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 