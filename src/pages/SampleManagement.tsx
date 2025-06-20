import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAllSamples,
  type SampleItem,
  type GetAllSamplesResponse,
} from "../Services/SampleService/GetAllSamples";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSample } from "../Services/SampleService/DeleteSample";
import {
  updateResult,
  type UpdateResultRequest,
} from "../Services/ResultService/UpdateResult";
import {
  updateSample,
  type UpdateSampleRequest,
} from "../Services/SampleService/UpdateSample";
import {
  createSample,
  type CreateSampleRequest,
} from "../Services/SampleService/CreateSample";

const SampleManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState<number | "all">("all");
  const [selectedResult, setSelectedResult] = useState<SampleItem | null>(null);
  const [updateFormData, setUpdateFormData] = useState<UpdateResultRequest>({
    id: 0,
    sampleId: 0,
    resultDate: "",
    conclusion: "",
    filePath: "",
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUpdateResultModal, setShowUpdateResultModal] = useState(false);
  const [selectedUpdateResultFile, setSelectedUpdateResultFile] =
    useState<File | null>(null);
  const [isUpdatingResultUploading, setIsUpdatingResultUploading] =
    useState(false);
  const [uploadedUpdateResultFilePath, setUploadedUpdateResultFilePath] =
    useState<string | null>(null);

  // Sample editing states
  const [showSampleEditModal, setShowSampleEditModal] = useState(false);
  const [selectedSampleForEdit, setSelectedSampleForEdit] =
    useState<SampleItem | null>(null);
  const [sampleEditFormData, setSampleEditFormData] =
    useState<UpdateSampleRequest>({
      id: 0,
      testOrderId: 0,
      collectionDate: "",
      receivedDate: "",
      sampleStatus: 0,
      notes: "",
      collectedBy: 0,
    });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateSampleRequest>({
    testOrderId: 0,
    collectionDate: "",
    receivedDate: "",
    sampleStatus: 0,
    notes: "",
    collectedBy: 0,
  });

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<GetAllSamplesResponse>({
    queryKey: ["samples", selectedStatus],
    queryFn: ({ signal }) =>
      getAllSamples({
        signal,
        sampleStatus: selectedStatus,
      }),
  });

  const deleteSampleMutation = useMutation({
    mutationFn: deleteSample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
      alert("Xóa mẫu thành công!");
    },
    onError: (err) => {
      alert(`Lỗi xóa mẫu: ${err.message}`);
    },
  });

  const updateResultMutation = useMutation({
    mutationFn: updateResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
      alert("Cập nhật kết quả thành công!");
    },
    onError: (err) => {
      alert(`Lỗi cập nhật kết quả: ${err.message}`);
    },
  });

  const updateSampleMutation = useMutation({
    mutationFn: updateSample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
      setShowSampleEditModal(false);
      setSelectedSampleForEdit(null);
      alert("Cập nhật mẫu thành công!");
    },
    onError: (err) => {
      alert(`Lỗi cập nhật mẫu: ${err.message}`);
    },
  });

  const createSampleMutation = useMutation({
    mutationFn: createSample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
      setShowCreateModal(false);
      setCreateFormData({
        testOrderId: 0,
        collectionDate: "",
        receivedDate: "",
        sampleStatus: 0,
        notes: "",
        collectedBy: 0,
      });
      alert("Tạo mẫu mới thành công!");
    },
    onError: (err) => {
      alert(`Lỗi tạo mẫu mới: ${err.message}`);
    },
  });

  const samples = data?.result || [];

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

  const handleDeleteSample = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mẫu này không?")) {
      deleteSampleMutation.mutate(id);
    }
  };

  const handleUpdateResult = (sample: SampleItem) => {
    setSelectedResult(sample);
    setUpdateFormData({
      id: sample.result?.id || 0,
      sampleId: sample.id,
      resultDate: sample.result?.resultDate || "",
      conclusion: sample.result?.conclusion || "",
      filePath: sample.result?.filePath || "",
    });
    setSelectedUpdateResultFile(null);
    setUploadedUpdateResultFilePath(sample.result?.filePath || null);
    setShowUpdateResultModal(true);
  };

  const handleUpdateClick = (sample: SampleItem) => {
    setSelectedResult(sample);
    setUpdateFormData({
      id: sample.result?.id || 0,
      sampleId: sample.id,
      resultDate: sample.result?.resultDate || "",
      conclusion: sample.result?.conclusion || "",
      filePath: sample.result?.filePath || "",
    });
    setShowUpdateModal(true);
  };

  const handleModalClose = () => {
    setShowUpdateModal(false);
    setSelectedResult(null);
    setUpdateFormData({
      id: 0,
      sampleId: 0,
      resultDate: "",
      conclusion: "",
      filePath: "",
    });
  };

  const handleUpdateResultModalClose = () => {
    setShowUpdateResultModal(false);
    setSelectedResult(null);
    setUpdateFormData({
      id: 0,
      sampleId: 0,
      resultDate: "",
      conclusion: "",
      filePath: "",
    });
    setSelectedUpdateResultFile(null);
    setIsUpdatingResultUploading(false);
    setUploadedUpdateResultFilePath(null);
  };

  const handleUpdateResultFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const uploadPdfToCloudinary = async (file: File): Promise<string> => {
    const CLOUDINARY_CLOUD_NAME = "dku0qdaan"; // Use your actual Cloudinary cloud name
    const CLOUDINARY_UPLOAD_PRESET = "ADN_SWP"; // Use your actual Cloudinary upload preset

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

  const handleUpdateResultFileUpload = async () => {
    if (!selectedUpdateResultFile) return;

    setIsUpdatingResultUploading(true);
    try {
      const url = await uploadPdfToCloudinary(selectedUpdateResultFile);
      setUploadedUpdateResultFilePath(url);
      setUpdateFormData((prev) => ({ ...prev, filePath: url }));
      alert("Tải lên tệp thành công!");
    } catch (err: any) {
      alert(`Lỗi tải lên tệp: ${err.message}`);
    } finally {
      setIsUpdatingResultUploading(false);
    }
  };

  const handleUpdateResultFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedResult) {
      const payload: UpdateResultRequest = {
        id: updateFormData.id,
        sampleId: updateFormData.sampleId,
        resultDate: updateFormData.resultDate,
        conclusion: updateFormData.conclusion,
        filePath: uploadedUpdateResultFilePath || updateFormData.filePath,
      };
      updateResultMutation.mutate(payload);
    }
    setShowUpdateResultModal(false);
  };

  const handleSampleEdit = (sample: SampleItem) => {
    setSelectedSampleForEdit(sample);
    setSampleEditFormData({
      id: sample.id,
      testOrderId: sample.testOrder.id,
      collectionDate: sample.collectionDate,
      receivedDate: sample.receivedDate,
      sampleStatus: sample.sampleStatus,
      notes: sample.notes,
      collectedBy: sample.collectedBy,
    });
    setShowSampleEditModal(true);
  };

  const handleSampleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setSampleEditFormData((prev) => ({
      ...prev,
      [name]:
        name === "testOrderId" ||
        name === "sampleStatus" ||
        name === "collectedBy"
          ? Number(value)
          : value,
    }));
  };

  const handleSampleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSampleMutation.mutate(sampleEditFormData);
  };

  const handleSampleEditModalClose = () => {
    setShowSampleEditModal(false);
    setSelectedSampleForEdit(null);
  };

  // Create sample handlers
  const handleCreateModalOpen = () => {
    setShowCreateModal(true);
    setCreateFormData({
      testOrderId: 0,
      collectionDate: "",
      receivedDate: "",
      sampleStatus: 0,
      notes: "",
      collectedBy: 0,
    });
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
  };

  const handleCreateFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [name]:
        name === "testOrderId" ||
        name === "sampleStatus" ||
        name === "collectedBy"
          ? Number(value)
          : value,
    }));
  };

  const handleCreateFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSampleMutation.mutate(createFormData);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Quản lý mẫu xét nghiệm
          </h2>
          <div className="flex space-x-4">
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
              <option value={0}>Chờ xử lý</option>
              <option value={1}>Đang xử lý</option>
              <option value={2}>Hoàn thành</option>
              <option value={3}>Đã hủy</option>
            </select>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={handleCreateModalOpen}
            >
              Thêm mẫu mới
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
                Mã mẫu xét nghiệm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn hẹn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại xét nghiệm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày lấy mẫu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày nhận mẫu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người lấy mẫu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ghi chú
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {samples.map((sample: SampleItem) => {
              console.log(
                "Debug: sample.result in SampleManagement:",
                sample.result
              );
              console.log("Sample Method:", sample.sampleMethod);
              return (
                <tr key={sample.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {sample.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {sample.testOrder.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sample.testOrder.serviceName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(sample.collectionDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(sample.receivedDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sample.collectorName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getSampleStatusText(sample.sampleStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sample.notes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleSampleEdit(sample)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Cập nhật
                    </button>
                    <button
                      onClick={() => handleDeleteSample(sample.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={deleteSampleMutation.isPending}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Update Result Modal */}
      {showUpdateResultModal && selectedResult && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/3">
            <h3 className="text-lg font-semibold mb-4">Cập nhật kết quả</h3>
            <form onSubmit={handleUpdateResultFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="updateResultDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ngày kết quả
                </label>
                <input
                  type="date"
                  id="updateResultDate"
                  name="resultDate"
                  value={
                    new Date(updateFormData.resultDate)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={handleUpdateResultFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="updateConclusion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kết luận
                </label>
                <textarea
                  id="updateConclusion"
                  name="conclusion"
                  rows={3}
                  value={updateFormData.conclusion}
                  onChange={handleUpdateResultFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="updateFilePath"
                  className="block text-sm font-medium text-gray-700"
                >
                  Đường dẫn tệp
                </label>
                <input
                  type="file"
                  id="updateFilePath"
                  name="filePath"
                  onChange={(e) =>
                    setSelectedUpdateResultFile(
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {(uploadedUpdateResultFilePath || updateFormData.filePath) && (
                  <a
                    href={
                      uploadedUpdateResultFilePath || updateFormData.filePath
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mt-2 inline-block"
                  >
                    📄 Xem file hiện tại
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleUpdateResultFileUpload}
                  disabled={
                    !selectedUpdateResultFile || isUpdatingResultUploading
                  }
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {isUpdatingResultUploading ? "Đang tải..." : "Tải lên file"}
                </button>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleUpdateResultModalClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={
                    updateResultMutation.isPending || isUpdatingResultUploading
                  }
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sample Edit Modal */}
      {showSampleEditModal && selectedSampleForEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa mẫu</h3>
            <form onSubmit={handleSampleEditFormSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label
                    htmlFor="sampleId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mã mẫu xét nghiệm
                  </label>
                  <input
                    type="number"
                    id="sampleId"
                    name="id"
                    value={sampleEditFormData.id}
                    onChange={handleSampleEditFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="testOrderId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID Đơn hẹn
                  </label>
                  <input
                    type="number"
                    id="testOrderId"
                    name="testOrderId"
                    value={sampleEditFormData.testOrderId}
                    onChange={handleSampleEditFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="collectionDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ngày lấy mẫu
                  </label>
                  <input
                    type="datetime-local"
                    id="collectionDate"
                    name="collectionDate"
                    value={sampleEditFormData.collectionDate.slice(0, 16)}
                    onChange={handleSampleEditFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="receivedDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ngày nhận mẫu
                  </label>
                  <input
                    type="datetime-local"
                    id="receivedDate"
                    name="receivedDate"
                    value={sampleEditFormData.receivedDate.slice(0, 16)}
                    onChange={handleSampleEditFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="sampleStatus"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Trạng thái mẫu
                  </label>
                  <select
                    id="sampleStatus"
                    name="sampleStatus"
                    value={sampleEditFormData.sampleStatus}
                    onChange={handleSampleEditFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value={0}>Chờ xử lý</option>
                    <option value={1}>Đang xử lý</option>
                    <option value={2}>Hoàn thành</option>
                    <option value={3}>Đã hủy</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="collectedBy"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID Người lấy mẫu
                  </label>
                  <input
                    type="number"
                    id="collectedBy"
                    name="collectedBy"
                    value={sampleEditFormData.collectedBy}
                    onChange={handleSampleEditFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ghi chú
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={sampleEditFormData.notes}
                  onChange={handleSampleEditFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleSampleEditModalClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={updateSampleMutation.isPending}
                >
                  {updateSampleMutation.isPending
                    ? "Đang cập nhật..."
                    : "Cập nhật mẫu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Sample Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/2 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Thêm mẫu mới</h3>
            <form onSubmit={handleCreateFormSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label
                    htmlFor="createTestOrderId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID Đơn hẹn
                  </label>
                  <input
                    type="number"
                    id="createTestOrderId"
                    name="testOrderId"
                    value={createFormData.testOrderId}
                    onChange={handleCreateFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="createCollectionDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ngày lấy mẫu
                  </label>
                  <input
                    type="datetime-local"
                    id="createCollectionDate"
                    name="collectionDate"
                    value={createFormData.collectionDate.slice(0, 16)}
                    onChange={handleCreateFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="createReceivedDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ngày nhận mẫu
                  </label>
                  <input
                    type="datetime-local"
                    id="createReceivedDate"
                    name="receivedDate"
                    value={createFormData.receivedDate.slice(0, 16)}
                    onChange={handleCreateFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="createSampleStatus"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Trạng thái mẫu
                  </label>
                  <select
                    id="createSampleStatus"
                    name="sampleStatus"
                    value={createFormData.sampleStatus}
                    onChange={handleCreateFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value={0}>Chờ xử lý</option>
                    <option value={1}>Đang xử lý</option>
                    <option value={2}>Hoàn thành</option>
                    <option value={3}>Đã hủy</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="createCollectedBy"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ID Người lấy mẫu
                  </label>
                  <input
                    type="number"
                    id="createCollectedBy"
                    name="collectedBy"
                    value={createFormData.collectedBy}
                    onChange={handleCreateFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="createNotes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ghi chú
                </label>
                <textarea
                  id="createNotes"
                  name="notes"
                  rows={3}
                  value={createFormData.notes}
                  onChange={handleCreateFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCreateModalClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={createSampleMutation.isPending}
                >
                  {createSampleMutation.isPending ? "Đang tạo..." : "Tạo mẫu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleManagement;

const getSampleStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "Chờ xử lý";
    case 1:
      return "Đang xử lý";
    case 2:
      return "Hoàn thành";
    case 3:
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};
