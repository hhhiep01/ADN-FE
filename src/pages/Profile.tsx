import React, { useState, useEffect } from 'react';
import { useGetUserProfile } from '../Services/UserAccountService/GetUserProfile';
import { useUpdateUserProfile } from '../Services/UserAccountService/UpdateUserProfile';
import type { UpdateUserProfileRequest } from '../Services/UserAccountService/UpdateUserProfile';

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
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
  const { data: userProfileResponse, isLoading, error: getUserError } = useGetUserProfile();
  const { mutate: updateUser, isPending: isUpdating, isSuccess, error: updateError } = useUpdateUserProfile();
  
  const [profile, setProfile] = useState<UserProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    if (userProfileResponse?.isSuccess && userProfileResponse.result) {
      setProfile({
        firstName: userProfileResponse.result.firstName || '',
        lastName: userProfileResponse.result.lastName || '',
        email: userProfileResponse.result.email || '',
        phoneNumber: userProfileResponse.result.phoneNumber || '',
        address: ''
      });
    }
  }, [userProfileResponse]);

  const testHistory: TestHistory[] = [
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
  ];

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const requestData: UpdateUserProfileRequest = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
      imgUrl: userProfileResponse?.result.imgUrl || '',
    };
    updateUser(requestData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (getUserError) {
    return (
      <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
        Lỗi khi tải thông tin cá nhân: {getUserError.message}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>

      {isSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p className="font-bold">Thành công!</p>
          <p>Thông tin cá nhân của bạn đã được cập nhật.</p>
        </div>
      )}

      {updateError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Thất bại!</p>
          <p>Không thể cập nhật thông tin: {updateError.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                {userProfileResponse?.result.imgUrl ? (
                  <img src={userProfileResponse.result.imgUrl} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl text-gray-400 flex items-center justify-center h-full">?</span>
                )}
              </div>
              <h2 className="text-xl font-semibold">{`${profile.firstName} ${profile.lastName}`}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleProfileUpdate} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
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
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={profile.phoneNumber}
                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
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

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
            </button>
          </form>
        </div>
      </div>

      {/* Test History Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử xét nghiệm</h2>
        <div className="space-y-4">
          {testHistory.map((test) => (
            <div key={test.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{test.testType}</h3>
                  <p className="text-sm text-gray-600">ID: {test.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{test.date}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    test.status === 'Hoàn thành' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {test.status}
                  </span>
                </div>
              </div>
              {test.result && (
                <p className="text-sm text-gray-700 mb-2">{test.result}</p>
              )}
              {test.details && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Độ chính xác:</span> {test.details.accuracy}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Kết luận:</span> {test.details.conclusion}
                  </p>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Khuyến nghị:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {test.details.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile; 