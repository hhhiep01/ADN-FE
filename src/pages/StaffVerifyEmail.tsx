import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { verifyEmail } from '../Services/AuthService/VerifyEmailService';
import type { ResponseModel } from '../model/responseModel';

interface ApiError extends Error {
  response?: {
    data: ResponseModel;
  };
}

const StaffVerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    if (userIdParam) {
      setUserId(parseInt(userIdParam));
    } else {
      navigate('/staff/login');
    }
  }, [searchParams, navigate]);

  const { mutate: verifyEmailMutate, isPending, isError, error, isSuccess, data } = useMutation({
    mutationFn: verifyEmail
  });

  // Handle success
  useEffect(() => {
    if (isSuccess && data && data.isSuccess) {
      navigate('/staff/login', {
        state: {
          message: 'Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.',
          type: 'success'
        }
      });
    }
  }, [isSuccess, data, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !verificationCode.trim()) {
      return;
    }

    verifyEmailMutate({
      userId: userId,
      verificationCode: verificationCode.trim()
    });
  };

  // Parse error message
  const getErrorMessage = () => {
    if (!isError || !error) return '';

    const apiError = error as ApiError;

    // First try to get from the actual response if available
    if (apiError.response?.data) {
      const responseData = apiError.response.data as ResponseModel;
      
      // Check if it's the BE response format
      if (!responseData.isSuccess) {
        // Prioritize result field for error message
        if (responseData.result) {
          return responseData.result;
        }
        // Fallback to errorMessage if result is null
        if (responseData.errorMessage) {
          return responseData.errorMessage;
        }
      }
    }

    const errorMessage = apiError.message;
    
    // Handle "Error: null" case
    if (errorMessage === 'Error: null' || errorMessage === 'null') {
      return 'Mã xác thực không hợp lệ hoặc đã hết hạn';
    }
    
    if (errorMessage.includes('Error: ') && errorMessage.includes(' - ')) {
      try {
        const responsePart = errorMessage.split(' - ')[1];
        const responseData: ResponseModel = JSON.parse(responsePart);
        
        // Check if error is in result field when isSuccess is false
        if (!responseData.isSuccess && responseData.result) {
          return responseData.result;
        }
        
        // Check if error is in errorMessage field
        if (responseData.errorMessage) {
          return responseData.errorMessage;
        }
        
      } catch (parseError) {
        return 'Có lỗi xảy ra khi xác thực';
      }
    }
    
    // Handle direct error messages
    if (errorMessage.includes('Invalid or expired verification code')) {
      return 'Mã xác thực không hợp lệ hoặc đã hết hạn';
    }
    
    return errorMessage || 'Có lỗi xảy ra khi xác thực';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ADN Testing</h1>
          <p className="text-gray-600 mb-8">Hệ thống quản lý nhân viên</p>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Xác thực email nhân viên
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Vui lòng nhập mã xác thực đã được gửi đến email của bạn
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{getErrorMessage()}</span>
              </div>
            )}

            {!userId && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">Không tìm thấy thông tin người dùng</span>
              </div>
            )}

            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                Mã xác thực *
              </label>
              <div className="mt-1">
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  maxLength={6}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-center text-lg font-mono tracking-widest"
                  placeholder="Nhập mã 6 số"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Mã xác thực gồm 6 chữ số được gửi đến email đăng ký của bạn
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending || !userId || !verificationCode.trim() || verificationCode.length !== 6}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Đang xác thực...' : 'Xác thực email'}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/staff/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffVerifyEmail; 