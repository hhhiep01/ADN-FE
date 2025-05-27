import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { verifyEmail } from '../Services/AuthService/VerifyEmailService';
import type { ResponseModel } from '../model/responseModel';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    if (userIdParam) {
      setUserId(parseInt(userIdParam));
    } else {
      navigate('/admin/login');
    }
  }, [searchParams, navigate]);

  const { mutate: verifyEmailMutate, isPending, isError, error, isSuccess, data } = useMutation({
    mutationFn: verifyEmail,
    onError: (err: any) => {
      console.log('Verify email error:', err);
    },
    onSuccess: (response: any) => {
      console.log('Verify email response:', response);
    }
  });

  // Handle success
  useEffect(() => {
    if (isSuccess && data && data.isSuccess) {
      navigate('/admin/login');
    }
  }, [isSuccess, data, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      return;
    }

    if (!verificationCode.trim()) {
      return;
    }

    verifyEmailMutate({
      userId: userId,
      verificationCode: verificationCode.trim()
    });
  };

  // Parse error message - prioritize BE response structure
  const getErrorMessage = () => {
    if (!isError || !error) return '';

    // First try to get from the actual response if available
    if (error.response?.data) {
      const responseData = error.response.data;
      
      // Check if it's the BE response format
      if (responseData.hasOwnProperty('isSuccess') && !responseData.isSuccess) {
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

    const errorMessage = error.message;
    
    // Handle "Error: null" case
    if (errorMessage === 'Error: null' || errorMessage === 'null') {
      return 'Mã xác thực không hợp lệ hoặc đã hết hạn';
    }
    
    if (errorMessage.includes('Error: ') && errorMessage.includes(' - ')) {
      try {
        const responsePart = errorMessage.split(' - ')[1];
        const responseData: ResponseModel = JSON.parse(responsePart);
        
        // Check if error is in result field when isSuccess is false
        if (!responseData?.isSuccess && responseData?.result) {
          return responseData.result;
        }
        
        // Check if error is in errorMessage field
        if (responseData?.errorMessage) {
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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Xác thực email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Vui lòng nhập mã xác thực đã được gửi đến email của bạn
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
                Mã xác thực
              </label>
              <div className="mt-1">
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mã xác thực"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending || !userId || !verificationCode.trim()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Đang xác thực...' : 'Xác thực'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Quay lại đăng nhập admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 