import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetAllSampleTypes } from "../Services/SampleTypeService/GetAllSampleTypes";
import { useCreateSampleType } from "../Services/SampleTypeService/CreateSampleType";
import { useUpdateSampleType } from "../Services/SampleTypeService/UpdateSampleType";
import { useDeleteSampleType } from "../Services/SampleTypeService/DeleteSampleType";

const SampleTypeManagement = () => {
  // Sample Type Management states
  const [showCreateSampleTypeModal, setShowCreateSampleTypeModal] = useState(false);
  const [showEditSampleTypeModal, setShowEditSampleTypeModal] = useState(false);
  const [editingSampleType, setEditingSampleType] = useState<any>(null);
  const [sampleTypeFormData, setSampleTypeFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [sampleTypeToDelete, setSampleTypeToDelete] = useState<any>(null);
  const [showDeleteSampleTypeModal, setShowDeleteSampleTypeModal] = useState(false);

  const queryClient = useQueryClient();

  // Sample Type Management queries and mutations
  const { data: sampleTypesData, isLoading: isLoadingSampleTypes } = useGetAllSampleTypes();
  const createSampleTypeMutation = useCreateSampleType();
  const updateSampleTypeMutation = useUpdateSampleType();
  const deleteSampleTypeMutation = useDeleteSampleType();

  const sampleTypes = sampleTypesData?.result || [];

  // Sample Type Management handlers
  const handleCreateSampleType = () => {
    setSampleTypeFormData({
      name: "",
      description: "",
      isActive: true,
    });
    setShowCreateSampleTypeModal(true);
  };

  const handleEditSampleType = (sampleType: any) => {
    setEditingSampleType(sampleType);
    setSampleTypeFormData({
      name: sampleType.name,
      description: sampleType.description || "",
      isActive: sampleType.isActive,
    });
    setShowEditSampleTypeModal(true);
  };

  const handleDeleteSampleType = (sampleType: any) => {
    setSampleTypeToDelete(sampleType);
    setShowDeleteSampleTypeModal(true);
  };

  const handleSampleTypeFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setSampleTypeFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSampleTypeFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showEditSampleTypeModal && editingSampleType) {
      updateSampleTypeMutation.mutate({
        id: editingSampleType.id.toString(),
        data: sampleTypeFormData,
      }, {
        onSuccess: () => {
          setShowEditSampleTypeModal(false);
          setEditingSampleType(null);
          alert("Cập nhật loại mẫu thành công!");
        },
        onError: (err) => {
          alert(`Lỗi cập nhật loại mẫu: ${err.message}`);
        },
      });
    } else {
      createSampleTypeMutation.mutate(sampleTypeFormData, {
        onSuccess: () => {
          setShowCreateSampleTypeModal(false);
          alert("Tạo loại mẫu thành công!");
        },
        onError: (err) => {
          alert(`Lỗi tạo loại mẫu: ${err.message}`);
        },
      });
    }
  };

  const handleConfirmDeleteSampleType = () => {
    if (sampleTypeToDelete) {
      deleteSampleTypeMutation.mutate(sampleTypeToDelete.id.toString(), {
        onSuccess: () => {
          setShowDeleteSampleTypeModal(false);
          setSampleTypeToDelete(null);
          alert("Xóa loại mẫu thành công!");
        },
        onError: (err) => {
          alert(`Lỗi xóa loại mẫu: ${err.message}`);
        },
      });
    }
  };

  if (isLoadingSampleTypes) {
    return (
      <div className="text-center py-12 text-gray-600">Đang tải dữ liệu...</div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Quản lý phân loại mẫu xét nghiệm
          </h2>
          <button
            onClick={handleCreateSampleType}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thêm loại mẫu mới
          </button>
        </div>
      </div>

      {/* Sample Type Management Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên loại mẫu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
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
            {sampleTypes.map((sampleType) => (
              <tr key={sampleType.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {sampleType.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sampleType.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sampleType.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    sampleType.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {sampleType.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditSampleType(sampleType)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDeleteSampleType(sampleType)}
                    className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Sample Type Modal */}
      {showEditSampleTypeModal && editingSampleType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Chỉnh sửa loại mẫu xét nghiệm</h3>
            <form onSubmit={handleSampleTypeFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên loại mẫu
                </label>
                <input
                  type="text"
                  name="name"
                  value={sampleTypeFormData.name}
                  onChange={handleSampleTypeFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={sampleTypeFormData.description}
                  onChange={handleSampleTypeFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={sampleTypeFormData.isActive}
                  onChange={(e) => setSampleTypeFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">
                  Hoạt động
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditSampleTypeModal(false);
                    setEditingSampleType(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={updateSampleTypeMutation.isPending}
                >
                  {updateSampleTypeMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Sample Type Modal */}
      {showCreateSampleTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Thêm loại mẫu xét nghiệm mới</h3>
            <form onSubmit={handleSampleTypeFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên loại mẫu
                </label>
                <input
                  type="text"
                  name="name"
                  value={sampleTypeFormData.name}
                  onChange={handleSampleTypeFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={sampleTypeFormData.description}
                  onChange={handleSampleTypeFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={sampleTypeFormData.isActive}
                  onChange={(e) => setSampleTypeFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">
                  Hoạt động
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateSampleTypeModal(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={createSampleTypeMutation.isPending}
                >
                  {createSampleTypeMutation.isPending ? "Đang tạo..." : "Tạo loại mẫu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Sample Type Modal */}
      {showDeleteSampleTypeModal && sampleTypeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Xác nhận xóa loại mẫu</h3>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa loại mẫu xét nghiệm{" "}
              <span className="font-semibold">{sampleTypeToDelete.name}</span>?
              <br />
              <span className="text-sm text-gray-500">
                (ID: {sampleTypeToDelete.id})
              </span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteSampleTypeModal(false);
                  setSampleTypeToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={deleteSampleTypeMutation.isPending}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDeleteSampleType}
                disabled={deleteSampleTypeMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteSampleTypeMutation.isPending ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleTypeManagement; 