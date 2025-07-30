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
import { createSample, type CreateSampleRequest, type Participant } from "../Services/SampleService/CreateSample";
import { useGetAllSampleTypes } from "../Services/SampleTypeService/GetAllSampleTypes";
import { getSamplesByTestOrderId } from "../Services/SampleService/GetSamplesByTestOrderId";

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

  // State for sample creation modal
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [selectedAppointmentForSample, setSelectedAppointmentForSample] = useState<TestOrderItem | null>(null);
  const [sampleFormData, setSampleFormData] = useState<CreateSampleRequest>({
    testOrderId: 0,
    participants: [
      {
        collectionDate: "",
        sampleStatus: 0,
        notes: "",
        participantName: "",
        relationship: "",
        sampleTypeId: 0,
        fingerprintImagePath: "",
      },
      {
        collectionDate: "",
        sampleStatus: 0,
        notes: "",
        participantName: "",
        relationship: "",
        sampleTypeId: 0,
        fingerprintImagePath: "",
      },
    ],
  });

  // States for fingerprint image upload
  const [selectedFingerprintImages, setSelectedFingerprintImages] = useState<{ [key: number]: File | null }>({});
  const [isFingerprintImageUploading, setIsFingerprintImageUploading] = useState<{ [key: number]: boolean }>({});
  const [uploadedFingerprintImageUrls, setUploadedFingerprintImageUrls] = useState<{ [key: number]: string }>({});

  // State to track appointments that already have samples
  const [appointmentsWithSamples, setAppointmentsWithSamples] = useState<Set<number>>(new Set());
  const [isCheckingSamples, setIsCheckingSamples] = useState<{ [key: number]: boolean }>({});

  // Function to check if an appointment has samples
  const checkAppointmentSamples = async (appointmentId: number) => {
    if (isCheckingSamples[appointmentId]) return;
    
    setIsCheckingSamples(prev => ({ ...prev, [appointmentId]: true }));
    try {
      const response = await getSamplesByTestOrderId(appointmentId.toString());
      if (response.isSuccess && response.result && response.result.length > 0) {
        setAppointmentsWithSamples(prev => new Set([...prev, appointmentId]));
      }
    } catch (error) {
      console.error(`Error checking samples for appointment ${appointmentId}:`, error);
    } finally {
      setIsCheckingSamples(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

  // Hàm upload ảnh vân tay lên Cloudinary
  const uploadFingerprintImageToCloudinary = async (file: File): Promise<string> => {
    const CLOUDINARY_CLOUD_NAME = "dku0qdaan";
    const CLOUDINARY_UPLOAD_PRESET = "ADN_SWP";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Cloudinary upload failed");
    }
    const data = await response.json();
    return data.secure_url;
  };

  const queryClient = useQueryClient();

  // Sample types query
  const { data: sampleTypesData, isLoading: isLoadingSampleTypes } = useGetAllSampleTypes();
  const sampleTypes = sampleTypesData?.result || [];

  const { data, isLoading, isError, error, refetch } = useQuery({
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

  const createSampleMutation = useMutation({
    mutationFn: createSample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testOrders"] });
      setShowSampleModal(false);
      setSelectedAppointmentForSample(null);
      // Add appointment ID to the set of appointments with samples
      if (selectedAppointmentForSample) {
        setAppointmentsWithSamples(prev => new Set([...prev, selectedAppointmentForSample.id]));
      }
      alert("Tạo mẫu xét nghiệm thành công!");
      // Refresh the appointments list to get updated data
      refetch();
    },
    onError: (err) => {
      alert(`Lỗi tạo mẫu xét nghiệm: ${err.message}`);
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

  // Sample modal handlers
  const handleShowSampleModal = (appointment: TestOrderItem) => {
    if (appointment.status !== 1) return;
    if (appointment.sampleMethods.id === 1 && appointment.deliveryKitStatus === 0) {
      alert("Không thể thêm mẫu xét nghiệm khi kit lấy mẫu chưa được gửi!");
      return;
    }
    
    setSelectedAppointmentForSample(appointment);
    setSampleFormData({
      testOrderId: appointment.id,
      participants: [
        {
          collectionDate: appointment.appointmentDate,
          sampleStatus: 0,
          notes: "",
          participantName: appointment.userName || appointment.fullName || "",
          relationship: "Chính",
          sampleTypeId: 0,
          fingerprintImagePath: "",
        },
        {
          collectionDate: appointment.appointmentDate,
          sampleStatus: 0,
          notes: "",
          participantName: "",
          relationship: "",
          sampleTypeId: 0,
          fingerprintImagePath: "",
        },
      ],
    });
    // Reset fingerprint image upload states
    setSelectedFingerprintImages({});
    setIsFingerprintImageUploading({});
    setUploadedFingerprintImageUrls({});
    setShowSampleModal(true);
  };

  const handleSampleModalClose = () => {
    setShowSampleModal(false);
    setSelectedAppointmentForSample(null);
    // Reset fingerprint image upload states
    setSelectedFingerprintImages({});
    setIsFingerprintImageUploading({});
    setUploadedFingerprintImageUrls({});
  };

  const handleSampleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSampleFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParticipantChange = (index: number, field: keyof Participant, value: string | number) => {
    setSampleFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((participant, i) =>
        i === index ? { ...participant, [field]: value } : participant
      ),
    }));
  };

  const handleSampleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra xem tất cả người tham gia có hình ảnh vân tay chưa
    const missingFingerprintImages = sampleFormData.participants.filter(
      (participant, index) => {
        const hasUploadedImage = uploadedFingerprintImageUrls[index];
        const hasExistingImage = participant.fingerprintImagePath;
        return !hasUploadedImage && !hasExistingImage;
      }
    );

    if (missingFingerprintImages.length > 0) {
      alert("⚠️ Bắt buộc phải có hình ảnh vân tay cho tất cả người tham gia trước khi gửi mẫu xét nghiệm!");
      return;
    }

    // Kiểm tra các trường bắt buộc khác
    const requiredFields = sampleFormData.participants.filter(
      (participant, index) => {
        return !participant.participantName || 
               !participant.relationship || 
               participant.sampleTypeId === 0 ||
               !participant.collectionDate;
      }
    );

    if (requiredFields.length > 0) {
      alert("⚠️ Vui lòng điền đầy đủ thông tin bắt buộc cho tất cả người tham gia!");
      return;
    }

    createSampleMutation.mutate(sampleFormData);
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
                    disabled={appointment.status !== 1 || appointment.sampleMethods.id === 1 || appointmentsWithSamples.has(appointment.id) || isCheckingSamples[appointment.id]}
                    onClick={() => handleShowSampleModal(appointment)}
                    onMouseEnter={() => checkAppointmentSamples(appointment.id)}
                  >
                    {isCheckingSamples[appointment.id] ? "Đang kiểm tra..." : 
                     appointmentsWithSamples.has(appointment.id) ? "Đã thêm mẫu" : "Thêm mẫu xét nghiệm"}
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

      {/* Sample Creation Modal */}
      {showSampleModal && selectedAppointmentForSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Thêm mẫu xét nghiệm</h3>
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-yellow-800 font-medium">Lưu ý quan trọng:</span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                Bắt buộc phải có hình ảnh vân tay cho tất cả người tham gia trước khi gửi mẫu xét nghiệm. 
                Vui lòng tải lên ảnh vân tay cho từng người tham gia.
              </p>
            </div>
            <form onSubmit={handleSampleFormSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã đơn hẹn
                </label>
                <input
                  type="number"
                  name="testOrderId"
                  value={sampleFormData.testOrderId}
                  onChange={handleSampleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Thông tin người tham gia</h4>
                {sampleFormData.participants.map((participant, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <h5 className="text-md font-medium text-gray-700 mb-3">
                      Người tham gia {index + 1}
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên người tham gia
                        </label>
                        <input
                          type="text"
                          value={participant.participantName}
                          onChange={(e) => handleParticipantChange(index, "participantName", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập tên người tham gia"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mối quan hệ
                        </label>
                        <input
                          type="text"
                          value={participant.relationship}
                          onChange={(e) => handleParticipantChange(index, "relationship", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ví dụ: Chính, Con, Vợ/Chồng..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại mẫu xét nghiệm
                        </label>
                        <select
                          value={participant.sampleTypeId}
                          onChange={(e) => handleParticipantChange(index, "sampleTypeId", Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isLoadingSampleTypes}
                        >
                          <option value={0}>Chọn loại mẫu</option>
                          {sampleTypes.map((sampleType) => (
                            <option key={sampleType.id} value={sampleType.id}>
                              {sampleType.name}
                            </option>
                          ))}
                        </select>
                        {isLoadingSampleTypes && (
                          <p className="text-sm text-gray-500 mt-1">Đang tải danh sách loại mẫu...</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày lấy mẫu
                        </label>
                        <input
                          type="datetime-local"
                          value={participant.collectionDate.slice(0, 16)}
                          onChange={(e) => handleParticipantChange(index, "collectionDate", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trạng thái mẫu
                        </label>
                        <input
                          type="text"
                          value="Chờ xử lý"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Đường dẫn hình ảnh vân tay <span className="text-red-500">*</span>
                        </label>
                        <div className="mb-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs text-red-600 font-medium">⚠️ Bắt buộc phải có hình ảnh vân tay</span>
                            {uploadedFingerprintImageUrls[index] || participant.fingerprintImagePath ? (
                              <span className="text-xs text-green-600 font-medium">✅ Đã tải lên</span>
                            ) : (
                              <span className="text-xs text-red-600 font-medium">❌ Chưa tải lên</span>
                            )}
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files ? e.target.files[0] : null;
                            setSelectedFingerprintImages(prev => ({
                              ...prev,
                              [index]: file
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {(uploadedFingerprintImageUrls[index] || participant.fingerprintImagePath) && (
                          <img
                            src={uploadedFingerprintImageUrls[index] || participant.fingerprintImagePath}
                            alt="Fingerprint Preview"
                            className="mt-2 w-32 h-20 object-cover rounded"
                          />
                        )}
                        <button
                          type="button"
                          onClick={async () => {
                            const file = selectedFingerprintImages[index];
                            if (file) {
                              setIsFingerprintImageUploading(prev => ({
                                ...prev,
                                [index]: true
                              }));
                              try {
                                const url = await uploadFingerprintImageToCloudinary(file);
                                setUploadedFingerprintImageUrls(prev => ({
                                  ...prev,
                                  [index]: url
                                }));
                                handleParticipantChange(index, "fingerprintImagePath", url);
                                alert("Tải lên ảnh vân tay thành công!");
                              } catch (err: any) {
                                alert(`Lỗi tải lên ảnh vân tay: ${err.message}`);
                              } finally {
                                setIsFingerprintImageUploading(prev => ({
                                  ...prev,
                                  [index]: false
                                }));
                              }
                            } else {
                              alert("Vui lòng chọn file ảnh trước khi tải lên!");
                            }
                          }}
                          disabled={!selectedFingerprintImages[index] || isFingerprintImageUploading[index]}
                          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm"
                        >
                          {isFingerprintImageUploading[index] ? "Đang tải..." : "Tải lên ảnh vân tay"}
                        </button>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ghi chú
                        </label>
                        <textarea
                          value={participant.notes}
                          onChange={(e) => handleParticipantChange(index, "notes", e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập ghi chú cho người tham gia này"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleSampleModalClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createSampleMutation.isPending || 
                    sampleFormData.participants.some((participant, index) => {
                      const hasUploadedImage = uploadedFingerprintImageUrls[index];
                      const hasExistingImage = participant.fingerprintImagePath;
                      return !hasUploadedImage && !hasExistingImage;
                    })
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createSampleMutation.isPending ? "Đang tạo..." : 
                   sampleFormData.participants.some((participant, index) => {
                     const hasUploadedImage = uploadedFingerprintImageUrls[index];
                     const hasExistingImage = participant.fingerprintImagePath;
                     return !hasUploadedImage && !hasExistingImage;
                   }) ? "Thiếu ảnh vân tay" : "Tạo mẫu xét nghiệm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
