import { useState } from 'react';
import type { User } from '../types/auth';

const UserManagement = () => {
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      role: 'customer',
      phone: '0123456789',
      address: 'Hà Nội',
      createdAt: '2024-02-20',
      updatedAt: '2024-02-20'
    },
    // Thêm dữ liệu mẫu khác ở đây
  ]);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Danh sách người dùng</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số điện thoại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Sửa
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Hiển thị 1 đến 10 của 100 kết quả
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
              Trước
            </button>
            <button className="px-3 py-1 border rounded-md bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 