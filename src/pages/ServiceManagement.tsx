import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Import types từ GetAllServices
import {
  useGetAllServices,
  type GetAllServicesResponse,
  type Service,
} from "../Services/ServiceService/GetAllServices";
import { deleteService } from "../Services/ServiceService/DeleteService";
import {
  updateService,
  type UpdateServiceRequest,
} from "../Services/ServiceService/UpdateService";
import {
  createService,
  type CreateServiceRequest,
} from "../Services/ServiceService/CreateService";
import {
  getAllSampleMethods,
  type SampleMethodItem,
  type GetAllSampleMethodsResponse,
} from "../Services/SampleService/GetAllSampleMethods";

const ServiceManagement = () => {
  const queryClient = useQueryClient();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(
    null
  );
  const [updateFormData, setUpdateFormData] = useState<
    Omit<UpdateServiceRequest, "id">
  >({
    name: "",
    description: "",
    price: 0,
    isActive: true,
    sampleMethodIds: [],
    image: "",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateServiceRequest>({
    name: "",
    description: "",
    price: 0,
    isActive: true,
    sampleMethodIds: [],
    image: "",
  });

  // States for image upload (create)
  const [selectedCreateImage, setSelectedCreateImage] = useState<File | null>(
    null
  );
  const [isCreatingImageUploading, setIsCreatingImageUploading] =
    useState(false);
  const [uploadedCreateImageUrl, setUploadedCreateImageUrl] =
    useState<string>("");

  // States for image upload (edit)
  const [selectedEditImage, setSelectedEditImage] = useState<File | null>(null);
  const [isEditingImageUploading, setIsEditingImageUploading] = useState(false);
  const [uploadedEditImageUrl, setUploadedEditImageUrl] = useState<string>("");

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
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

  const { data, isLoading, isError, error } = useGetAllServices();

  const { data: sampleMethodsData } = useQuery<GetAllSampleMethodsResponse>({
    queryKey: ["sampleMethods"],
    queryFn: ({ signal }) => getAllSampleMethods(signal),
  });

  const deleteServiceMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      alert("Xóa dịch vụ thành công!");
    },
    onError: (err: any) => {
      alert(`Lỗi xóa dịch vụ: ${err.message}`);
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setShowUpdateModal(false);
      setSelectedService(null);
      alert("Cập nhật dịch vụ thành công!");
    },
    onError: (err: any) => {
      alert(`Lỗi cập nhật dịch vụ: ${err.message}`);
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setShowCreateModal(false);
      setCreateFormData({
        name: "",
        description: "",
        price: 0,
        isActive: true,
        sampleMethodIds: [],
        image: "",
      });
      setSelectedCreateImage(null);
      setUploadedCreateImageUrl("");
      alert("Thêm dịch vụ mới thành công!");
    },
    onError: (err: any) => {
      alert(`Lỗi thêm dịch vụ mới: ${err.message}`);
    },
  });

  const services = data?.result || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu dịch vụ...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Lỗi tải dữ liệu
          </h1>
          <p className="text-gray-600 mb-4">
            {error?.message || "Đã xảy ra lỗi khi tải dữ liệu dịch vụ."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const handleDeleteService = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) {
      deleteServiceMutation.mutate(id.toString());
    }
  };

  const handleUpdateClick = (service: Service) => {
    setSelectedService(service);
    setUpdateFormData({
      name: service.name,
      description: service.description || "",
      price: service.price,
      isActive: service.isActive,
      sampleMethodIds: service.sampleMethods.map((sm) => sm.id) || [],
      image: service.image || "",
    });
    setSelectedEditImage(null);
    setUploadedEditImageUrl("");
    setShowUpdateModal(true);
  };

  const handleModalClose = () => {
    setShowUpdateModal(false);
    setSelectedService(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: name === "price" ? Number(value) : value,
    }));
  };
  
  const handleUpdateSampleMethodChange = (selectedIds: number[]) => {
    setUpdateFormData((prev) => ({ ...prev, sampleMethodIds: selectedIds }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    const payload: UpdateServiceRequest = {
      id: selectedService.id,
      ...updateFormData,
      image: uploadedEditImageUrl || updateFormData.image,
    };
    updateServiceMutation.mutate(payload);
  };

  const handleCreateClick = () => {
    setCreateFormData({
      name: "",
      description: "",
      price: 0,
      isActive: true,
      sampleMethodIds: [],
      image: "",
    });
    setSelectedCreateImage(null);
    setUploadedCreateImageUrl("");
    setShowCreateModal(true);
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
  };

  const handleCreateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateFormData((prevData) => ({
      ...prevData,
      [name]: name === "price" ? Number(value) : value,
    }));
  };
  
  const handleCreateSampleMethodChange = (selectedIds: number[]) => {
    setCreateFormData((prev) => ({ ...prev, sampleMethodIds: selectedIds }));
  };

  const handleCreateFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createServiceMutation.mutate({
      ...createFormData,
      image: uploadedCreateImageUrl,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Quản lý dịch vụ
          </h2>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thêm dịch vụ mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã dịch vụ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên dịch vụ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phương thức lấy mẫu
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
            {services.map((service: Service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {service.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{service.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {service.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {service.price.toLocaleString()} đ
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {service.sampleMethods &&
                    service.sampleMethods.length > 0 ? (
                      <div className="space-y-1">
                        {service.sampleMethods.map((method) => (
                          <span
                            key={method.id}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                          >
                            {method.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">Chưa có</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      service.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {service.isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleUpdateClick(service)}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={deleteServiceMutation.isPending}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Service Modal */}
      {showUpdateModal && selectedService && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/3">
            <h3 className="text-lg font-semibold mb-4">Cập nhật dịch vụ</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên dịch vụ
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={updateFormData.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mô tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={updateFormData.description}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giá
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={updateFormData.price}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  min={0}
                />
              </div>
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={updateFormData.isActive}
                    onChange={(e) =>
                      setUpdateFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Hoạt động
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức lấy mẫu
                </label>
                {sampleMethodsData?.result && (
                  <div className="flex flex-wrap gap-4">
                    {sampleMethodsData.result.map((method: SampleMethodItem) => (
                      <label key={method.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={updateFormData.sampleMethodIds.includes(method.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleUpdateSampleMethodChange([
                                ...updateFormData.sampleMethodIds,
                                method.id,
                              ]);
                            } else {
                              handleUpdateSampleMethodChange(
                                updateFormData.sampleMethodIds.filter((id) => id !== method.id)
                              );
                            }
                          }}
                        />
                        <span>{method.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ảnh
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) =>
                    setSelectedEditImage(
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {(uploadedEditImageUrl || updateFormData.image) && (
                  <img
                    src={uploadedEditImageUrl || updateFormData.image}
                    alt="Preview"
                    className="mt-2 w-32 h-20 object-cover rounded"
                  />
                )}
                <button
                  type="button"
                  onClick={async () => {
                    if (selectedEditImage) {
                      setIsEditingImageUploading(true);
                      try {
                        const url = await uploadImageToCloudinary(
                          selectedEditImage
                        );
                        setUploadedEditImageUrl(url);
                        alert("Tải lên ảnh thành công!");
                      } catch (err: any) {
                        alert(`Lỗi tải lên ảnh: ${err.message}`);
                      } finally {
                        setIsEditingImageUploading(false);
                      }
                    }
                  }}
                  disabled={!selectedEditImage || isEditingImageUploading}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {isEditingImageUploading ? "Đang tải..." : "Tải lên ảnh"}
                </button>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={updateServiceMutation.isPending}
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/3">
            <h3 className="text-lg font-semibold mb-4">Thêm dịch vụ mới</h3>
            <form onSubmit={handleCreateFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="createName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên dịch vụ
                </label>
                <input
                  type="text"
                  id="createName"
                  name="name"
                  value={createFormData.name}
                  onChange={handleCreateFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="createDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mô tả
                </label>
                <textarea
                  id="createDescription"
                  name="description"
                  rows={3}
                  value={createFormData.description}
                  onChange={handleCreateFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="createPrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giá
                </label>
                <input
                  type="number"
                  id="createPrice"
                  name="price"
                  value={createFormData.price}
                  onChange={handleCreateFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                  min={0}
                />
              </div>
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="createIsActive"
                    name="isActive"
                    checked={createFormData.isActive}
                    onChange={(e) =>
                      setCreateFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="createIsActive"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Hoạt động
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức lấy mẫu
                </label>
                {sampleMethodsData?.result && (
                  <div className="flex flex-wrap gap-4">
                    {sampleMethodsData.result.map((method: SampleMethodItem) => (
                      <label key={method.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={createFormData.sampleMethodIds.includes(method.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleCreateSampleMethodChange([
                                ...createFormData.sampleMethodIds,
                                method.id,
                              ]);
                            } else {
                              handleCreateSampleMethodChange(
                                createFormData.sampleMethodIds.filter((id) => id !== method.id)
                              );
                            }
                          }}
                        />
                        <span>{method.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="createImage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ảnh
                </label>
                <input
                  type="file"
                  id="createImage"
                  accept="image/*"
                  onChange={(e) =>
                    setSelectedCreateImage(
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {uploadedCreateImageUrl && (
                  <img
                    src={uploadedCreateImageUrl}
                    alt="Preview"
                    className="mt-2 w-32 h-20 object-cover rounded"
                  />
                )}
                <button
                  type="button"
                  onClick={async () => {
                    if (selectedCreateImage) {
                      setIsCreatingImageUploading(true);
                      try {
                        const url = await uploadImageToCloudinary(
                          selectedCreateImage
                        );
                        setUploadedCreateImageUrl(url);
                        alert("Tải lên ảnh thành công!");
                      } catch (err: any) {
                        alert(`Lỗi tải lên ảnh: ${err.message}`);
                      } finally {
                        setIsCreatingImageUploading(false);
                      }
                    }
                  }}
                  disabled={!selectedCreateImage || isCreatingImageUploading}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {isCreatingImageUploading ? "Đang tải..." : "Tải lên ảnh"}
                </button>
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
                  disabled={createServiceMutation.isPending}
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement; 