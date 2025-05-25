import { useState } from 'react';

interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  testType: string;
  appointmentDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  result?: string;
  createdAt: string;
}

const AppointmentManagement = () => {
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@example.com',
      customerPhone: '0123456789',
      testType: 'Xét nghiệm ADN cha con',
      appointmentDate: '2024-03-01 09:00',
      status: 'pending',
      createdAt: '2024-02-20'
    },
    {
      id: '2',
      customerName: 'Trần Thị B',
      customerEmail: 'tranthib@example.com',
      customerPhone: '0987654321',
      testType: 'Xét nghiệm ADN huyết thống',
      appointmentDate: '2024-03-02 14:00',
      status: 'confirmed',
      result: 'Kết quả: 99.99% khả năng có quan hệ huyết thống',
      createdAt: '2024-02-21'
    }
  ]);

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Danh sách đơn hẹn</h2>
          <div className="flex space-x-4">
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Thêm đơn hẹn
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại xét nghiệm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày hẹn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
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
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{appointment.customerName}</div>
                  <div className="text-sm text-gray-500">{appointment.customerEmail}</div>
                  <div className="text-sm text-gray-500">{appointment.customerPhone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.testType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.appointmentDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status === 'pending' && 'Chờ xác nhận'}
                    {appointment.status === 'confirmed' && 'Đã xác nhận'}
                    {appointment.status === 'completed' && 'Hoàn thành'}
                    {appointment.status === 'cancelled' && 'Đã hủy'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {appointment.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Chi tiết
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Hủy
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

export default AppointmentManagement; 