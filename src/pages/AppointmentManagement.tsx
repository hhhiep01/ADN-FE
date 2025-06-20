import { useState } from "react";
import {
  type TestOrderItem,
  getAllTestOrders,
} from "../Services/TestOrderService/GetAllTestOrder";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTestOrderDeliveryStatus } from "../Services/TestOrderService/UpdateTestOrderDeliveryStatus";
import { updateTestOrderStatus } from "../Services/TestOrderService/UpdateTestOrderStatus";
import {
  updateTestOrder,
  type UpdateTestOrderRequest,
} from "../Services/TestOrderService/UpdateTestOrder";

const sampleCollectionMethods = [
  {
    id: 2,
    name: "Lấy mẫu tại trung tâm",
  },
  {
    id: 3,
    name: "Nhân viên lấy mẫu tại nhà",
  },
  {
    id: 1,
    name: "Tự lấy mẫu tại nhà",
  },
];

const AppointmentManagement = () => {
  const [selectedMethod, setSelectedMethod] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can make this dynamic if needed
  const [selectedStatus, setSelectedStatus] = useState<number | "all">("all");

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingTestOrder, setEditingTestOrder] =
    useState<TestOrderItem | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateTestOrderRequest>({
    id: 0,
    serviceId: 0,
    sampleMethodId: 0,
    phoneNumber: "",
    email: "",
    fullName: "",
    appointmentDate: "",
    appointmentLocation: "",
  });

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "testOrders",
      selectedMethod,
      currentPage,
      itemsPerPage,
      selectedStatus,
    ],
    queryFn: ({ signal }) =>
      getAllTestOrders({
        signal,
        sampleMethodId: selectedMethod,
        pageIndex: currentPage,
        pageSize: itemsPerPage,
        testOrderStatus: selectedStatus,
      }),
  });

  const updateDeliveryStatusMutation = useMutation({
    mutationFn: updateTestOrderDeliveryStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testOrders"] });
      alert("Cập nhật trạng thái kit lấy mẫu thành công!");
    },
    onError: (err) => {
      alert(`Lỗi cập nhật trạng thái kit lấy mẫu: ${err.message}`);
    },
  });

  const updateAppointmentStatusMutation = useMutation({
    mutationFn: updateTestOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testOrders"] });
      alert("Cập nhật trạng thái đơn hẹn thành công!");
    },
    onError: (err) => {
      alert(`Lỗi cập nhật trạng thái đơn hẹn: ${err.message}`);
    },
  });

  const updateTestOrderMutation = useMutation({
    mutationFn: updateTestOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testOrders"] });
      setIsEditModalOpen(false);
      setEditingTestOrder(null);
      alert("Cập nhật đơn hẹn thành công!");
    },
    onError: (err) => {
      alert(`Lỗi cập nhật đơn hẹn: ${err.message}`);
    },
  });

  const appointments = data?.result?.items || [];
  const totalItems = data?.result?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: // Pending
        return "bg-yellow-100 text-yellow-800";
      case 1: // Confirmed
        return "bg-blue-100 text-blue-800";
      case 2: // Completed
        return "bg-green-100 text-green-800";
      case 3: // Cancelled
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Đã xác nhận";
      case 2:
        return "Hoàn thành";
      case 3:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getDeliveryKitStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Chưa gửi";
      case 1:
        return "Đã gửi";
      case 2:
        return "Đã nhận";
      case 3:
        return "Đã trả về";
      default:
        return "Không xác định";
    }
  };

  const handleDeliveryStatusChange = (id: number, newStatus: number) => {
    updateDeliveryStatusMutation.mutate({ id, deliveryKitStatus: newStatus });
  };

  const handleAppointmentStatusChange = (id: number, newStatus: number) => {
    updateAppointmentStatusMutation.mutate({ id, testOrderStatus: newStatus });
  };

  const handleEdit = (testOrder: TestOrderItem) => {
    setEditingTestOrder(testOrder);
    setEditFormData({
      id: testOrder.id,
      serviceId: testOrder.services.id,
      sampleMethodId: testOrder.sampleMethods.id,
      phoneNumber: testOrder.phoneNumber,
      email: testOrder.email,
      fullName: testOrder.fullName,
      appointmentDate: testOrder.appointmentDate,
      appointmentLocation: testOrder.appointmentLocation,
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]:
        name === "serviceId" || name === "sampleMethodId"
          ? Number(value)
          : value,
    }));
  };

  const handleUpdateTestOrder = () => {
    updateTestOrderMutation.mutate(editFormData);
  };

  const filteredAppointments = appointments;

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // Max number of page buttons to display
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 border rounded-md ${
            currentPage === i ? "bg-blue-600 text-white" : "hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-600">Đang tải dữ liệu...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-600">
        Lỗi: {error?.message || "Đã xảy ra lỗi khi tải dữ liệu."}
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Danh sách đơn hẹn
          </h2>
          <div className="flex space-x-4">
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedMethod}
              onChange={(e) =>
                setSelectedMethod(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                )
              }
            >
              <option value="all">Tất cả phương thức lấy mẫu</option>
              {sampleCollectionMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                )
              }
            >
              <option value="all">Tất cả trạng thái</option>
              <option value={0}>Chờ xác nhận</option>
              <option value={1}>Đã xác nhận</option>
              <option value={2}>Hoàn thành</option>
              <option value={3}>Đã hủy</option>
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
                Mã đơn hẹn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số điện thoại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại xét nghiệm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phương thức lấy mẫu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa điểm hẹn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái kit lấy mẫu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày hẹn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái đơn hẹn
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
                  <div className="text-sm font-medium text-gray-900">
                    {appointment.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {appointment.userName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {appointment.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {appointment.phoneNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {appointment.services.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {appointment.sampleMethods.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {appointment.appointmentLocation}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.sampleMethods.id === 1 ? (
                    <select
                      value={appointment.deliveryKitStatus}
                      onChange={(e) =>
                        handleDeliveryStatusChange(
                          appointment.id,
                          Number(e.target.value)
                        )
                      }
                      className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={updateDeliveryStatusMutation.isPending}
                    >
                      <option value={0}>Chưa gửi</option>
                      <option value={1}>Đã gửi</option>
                      <option value={2}>Đã nhận</option>
                      <option value={3}>Đã trả về</option>
                    </select>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={appointment.status}
                    onChange={(e) =>
                      handleAppointmentStatusChange(
                        appointment.id,
                        Number(e.target.value)
                      )
                    }
                    className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={updateAppointmentStatusMutation.isPending}
                  >
                    <option value={0}>Chờ xác nhận</option>
                    <option value={1}>Đã xác nhận</option>
                    <option value={2}>Hoàn thành</option>
                    <option value={3}>Đã hủy</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleEdit(appointment)}
                  >
                    Chỉnh sửa
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
            Hiển thị {startIndex + 1} đến {endIndex} của {totalItems} kết quả
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Edit Test Order Modal */}
      {isEditModalOpen && editingTestOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Chỉnh sửa đơn hẹn</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={editFormData.fullName}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Loại xét nghiệm
                </label>
                <select
                  name="serviceId"
                  value={editFormData.serviceId}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={editingTestOrder.services.id}>
                    {editingTestOrder.services.name}
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phương thức lấy mẫu
                </label>
                <select
                  name="sampleMethodId"
                  value={editFormData.sampleMethodId}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {sampleCollectionMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa điểm hẹn
                </label>
                <input
                  type="text"
                  name="appointmentLocation"
                  value={editFormData.appointmentLocation}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày hẹn
                </label>
                <input
                  type="datetime-local"
                  name="appointmentDate"
                  value={editFormData.appointmentDate.slice(0, 16)}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingTestOrder(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateTestOrder}
                disabled={updateTestOrderMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {updateTestOrderMutation.isPending
                  ? "Đang cập nhật..."
                  : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
