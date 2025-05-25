import { useState } from 'react';

interface TestRequest {
  id: string;
  customerName: string;
  testType: string;
  date: string;
  status: 'pending' | 'processing' | 'completed';
  collectionMethod: string;
}

interface Statistics {
  totalTests: number;
  pendingTests: number;
  completedTests: number;
  revenue: number;
}

const Dashboard = () => {
  const [stats] = useState<Statistics>({
    totalTests: 150,
    pendingTests: 25,
    completedTests: 125,
    revenue: 375000000
  });

  const [testRequests] = useState<TestRequest[]>([
    {
      id: 'ADN-2024-003',
      customerName: 'Nguyễn Văn A',
      testType: 'Xét nghiệm ADN Cha - Con',
      date: '2024-02-22',
      status: 'pending',
      collectionMethod: 'Tự thu mẫu tại nhà'
    },
    {
      id: 'ADN-2024-004',
      customerName: 'Trần Thị B',
      testType: 'Xét nghiệm ADN Mẹ - Con',
      date: '2024-02-22',
      status: 'processing',
      collectionMethod: 'Thu mẫu tại cơ sở'
    }
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Tổng số xét nghiệm</h3>
          <p className="text-2xl font-semibold mt-2">{stats.totalTests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Đang chờ xử lý</h3>
          <p className="text-2xl font-semibold mt-2">{stats.pendingTests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Đã hoàn thành</h3>
          <p className="text-2xl font-semibold mt-2">{stats.completedTests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Doanh thu</h3>
          <p className="text-2xl font-semibold mt-2">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenue)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Yêu cầu xét nghiệm gần đây</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã xét nghiệm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại xét nghiệm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phương thức thu mẫu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.testType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.collectionMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      request.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status === 'completed' ? 'Hoàn thành' :
                       request.status === 'processing' ? 'Đang xử lý' :
                       'Chờ xử lý'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 