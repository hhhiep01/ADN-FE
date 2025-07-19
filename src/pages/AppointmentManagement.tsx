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
import { useDeleteTestOrder } from "../Services/TestOrderService/DeleteTestOrder";
import { createSample } from "../Services/SampleService/CreateSample";

const sampleCollectionMethods = [
  {
    id: 2,
    name: "Lấy mẫu tại trung tâm",
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

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [testOrderToDelete, setTestOrderToDelete] = useState<TestOrderItem | null>(null);

  // State for send kit test modal
  const [showSendKitModal, setShowSendKitModal] = useState(false);
  const [sendKitForm, setSendKitForm] = useState<UpdateTestOrderRequest | null>(null);
  const [sendingKit, setSendingKit] = useState(false);

  // State cho popup gửi kit test
  // Remove all state related to send kit modal
  // const [showSendKitModal, setShowSendKitModal] = useState(false);
  // const [selectedAppointment, setSelectedAppointment] = useState<TestOrderItem | null>(null);
  // const [isSendingKit, setIsSendingKit] = useState(false);
  // const [sendKitForm, setSendKitForm] = useState<UpdateTestOrderRequest | null>(null);
  // const [sendKitDeliveryStatus, setSendKitDeliveryStatus] = useState<number | null>(null);

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

  const deleteTestOrderMutation = useDeleteTestOrder();

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
        return "Đã gửi về";
      case 3:
        return "Đã nhận kit";
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

  const handleDelete = (testOrder: TestOrderItem) => {
    setTestOrderToDelete(testOrder);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (testOrderToDelete) {
      deleteTestOrderMutation.mutate(testOrderToDelete.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setTestOrderToDelete(null);
          alert("Xóa đơn hẹn thành công!");
        },
        onError: (err) => {
          alert(`Lỗi xóa đơn hẹn: ${err.message}`);
        },
      });
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTestOrderToDelete(null);
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
            Quản lý đơn hẹn
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
                Ngày & giờ hẹn
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
                  {/* Hiển thị text trạng thái kit thay vì dropdown */}
                  <span className="text-sm text-gray-900">
                    {getDeliveryKitStatusText(appointment.deliveryKitStatus)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {appointment.appointmentDate
                      ? new Date(appointment.appointmentDate).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })
                      : "---"}
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
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={appointment.status !== 1}
                    onClick={async () => {
                      if (appointment.status !== 1) return;
                      if (appointment.sampleMethods.id === 1 && appointment.deliveryKitStatus === 0) {
                        alert("Không thể thêm mẫu xét nghiệm khi kit lấy mẫu chưa được gửi!");
                        return;
                      }
                      try {
                        await createSample({
                          testOrderId: appointment.id,
                          collectionDate: appointment.appointmentDate,
                          receivedDate: "",
                          sampleStatus: 0,
                          notes: "Tạo từ quản lý đơn hẹn",
                          shippingProvider: "",
                          trackingNumber: "",
                        });
                        alert("Tạo mẫu xét nghiệm thành công!");
                      } catch (err) {
                        alert("Tạo mẫu xét nghiệm thất bại!");
                      }
                    }}
                  >
                    Thêm mẫu xét nghiệm
                  </button>
                  {/* Button gửi kit test - now opens editable modal */}
                  <button
                    className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={updateDeliveryStatusMutation.isPending || appointment.sampleMethods.id === 2}
                    onClick={() => {
                      setSendKitForm({
                        id: appointment.id,
                        serviceId: appointment.services.id,
                        sampleMethodId: appointment.sampleMethods.id,
                        phoneNumber: appointment.phoneNumber,
                        email: appointment.email,
                        fullName: appointment.userName || appointment.fullName,
                        appointmentDate: appointment.appointmentDate,
                        appointmentLocation: appointment.appointmentLocation,
                      });
                      setShowSendKitModal(true);
                    }}
                  >
                    Gửi kit test
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={editFormData.sampleMethodId === 2}
                  placeholder={editFormData.sampleMethodId === 2 ? "Không cần nhập khi lấy mẫu tại trung tâm" : "Nhập địa điểm hẹn"}
                />
                {editFormData.sampleMethodId === 2 && (
                  <p className="mt-1 text-sm text-gray-500">
                    Không cần nhập địa điểm hẹn khi chọn lấy mẫu tại trung tâm
                  </p>
                )}
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && testOrderToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Xác nhận xóa</h3>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa đơn hẹn của khách hàng{" "}
              <span className="font-semibold">{testOrderToDelete.fullName}</span>?
              <br />
              <span className="text-sm text-gray-500">
                (Mã đơn hẹn: {testOrderToDelete.id})
              </span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={deleteTestOrderMutation.isPending}
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteTestOrderMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteTestOrderMutation.isPending ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal gửi kit test với các trường có thể chỉnh sửa */}
      {showSendKitModal && sendKitForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-2 animate-fadeIn">
            <h3 className="text-2xl font-bold mb-6 text-center text-blue-700 tracking-wide">Xác nhận gửi kit test</h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Mã đơn hẹn:</label>
                <div className="bg-gray-100 rounded px-3 py-2 text-gray-800">{sendKitForm.id}</div>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Khách hàng</label>
                <input type="text" className="border rounded-lg px-3 py-2 w-full" value={sendKitForm.fullName} onChange={e => setSendKitForm(f => ({ ...f!, fullName: e.target.value }))} />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" className="border rounded-lg px-3 py-2 w-full" value={sendKitForm.email} onChange={e => setSendKitForm(f => ({ ...f!, email: e.target.value }))} />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Số điện thoại</label>
                <input type="tel" className="border rounded-lg px-3 py-2 w-full" value={sendKitForm.phoneNumber} onChange={e => setSendKitForm(f => ({ ...f!, phoneNumber: e.target.value }))} />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Địa điểm hẹn</label>
                <input type="text" className="border rounded-lg px-3 py-2 w-full" value={sendKitForm.appointmentLocation} onChange={e => setSendKitForm(f => ({ ...f!, appointmentLocation: e.target.value }))} />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Ngày hẹn</label>
                <input type="datetime-local" className="border rounded-lg px-3 py-2 w-full" value={sendKitForm.appointmentDate.slice(0,16)} onChange={e => setSendKitForm(f => ({ ...f!, appointmentDate: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => { setShowSendKitModal(false); setSendKitForm(null); }}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                disabled={sendingKit}
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  setSendingKit(true);
                  try {
                    await updateTestOrderDeliveryStatus({ id: sendKitForm.id, deliveryKitStatus: 1 });
                    alert("Gửi kit test thành công!");
                    setShowSendKitModal(false);
                    setSendKitForm(null);
                    queryClient.invalidateQueries({ queryKey: ["testOrders"] });
                  } catch (err) {
                    alert("Gửi kit test thất bại!");
                  } finally {
                    setSendingKit(false);
                  }
                }}
                disabled={sendingKit}
                className="px-5 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-700 shadow hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60"
              >
                {sendingKit ? "Đang gửi..." : "Xác nhận gửi kit test"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
