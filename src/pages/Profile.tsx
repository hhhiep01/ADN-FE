import { useState } from 'react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface TestHistory {
  id: string;
  testType: string;
  date: string;
  status: string;
  result?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    address: '123 Đường ABC, Quận XYZ, TP. HCM'
  });

  const [testHistory] = useState<TestHistory[]>([
    {
      id: 'ADN-2024-001',
      testType: 'Xét nghiệm ADN Cha - Con',
      date: '2024-02-20',
      status: 'Hoàn thành',
      result: '99.99% khả năng có quan hệ huyết thống'
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleProfileUpdate} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
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

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Cập nhật thông tin
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Lịch sử xét nghiệm</h2>
        <div className="space-y-4">
          {testHistory.map((test) => (
            <div key={test.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{test.testType}</h3>
                  <p className="text-sm text-gray-600">Mã xét nghiệm: {test.id}</p>
                  <p className="text-sm text-gray-600">Ngày thực hiện: {test.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  test.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                  test.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {test.status}
                </span>
              </div>
              {test.result && (
                <p className="mt-2 text-sm text-gray-700">{test.result}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile; 