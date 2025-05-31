import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { verifyEmail } from '../Services/AuthService/VerifyEmailService';
import type { ResponseModel } from '../model/responseModel';

const CustomerVerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    if (userIdParam) {
      setUserId(parseInt(userIdParam));
    } else {
      navigate('/customer/login');
    }
  }, [searchParams, navigate]);

  const { mutate: verifyEmailMutate, isPending, isError, error, isSuccess, data } = useMutation({
    mutationFn: verifyEmail
  });

  // Handle success
  useEffect(() => {
    if (isSuccess && data && data.isSuccess) {
      navigate('/customer/login');
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
        
        if (!responseData?.isSuccess && responseData?.result) {
          return responseData.result;
        }
        
      } catch (parseError) {
        return 'Có lỗi xảy ra khi xác thực';
      }
    }
    
    return errorMessage || 'Có lỗi xảy ra khi xác thực';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ADN Testing</h1>
          <p className="text-gray-600 mb-8">Dịch vụ xét nghiệm DNA chuyên nghiệp</p>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Xác thực email khách hàng
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

            {isSuccess && data && data.isSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.</span>
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono tracking-widest"
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
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Đang xác thực...' : 'Xác thực email'}
              </button>
            </div>

            <div className="text-center space-y-3">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500 underline"
                onClick={() => {
                  // TODO: Implement resend verification code
                  console.log('Resend verification code for userId:', userId);
                }}
              >
                Gửi lại mã xác thực
              </button>
              
              <div>
                <Link
                  to="/customer/login"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerVerifyEmail; 