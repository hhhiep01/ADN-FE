import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAllResults,
  type GetAllResultsResponse,
  type ResultItem,
} from "../Services/ResultService/GetAllResults";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteResult } from "../Services/ResultService/DeleteResult";
import {
  updateResult,
  type UpdateResultRequest,
} from "../Services/ResultService/UpdateResult";
import {
  createResult,
  type CreateResultRequest,
} from "../Services/ResultService/CreateResult";

const ResultManagement = () => {
  const queryClient = useQueryClient();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ResultItem | null>(null);
  const [updateFormData, setUpdateFormData] = useState<
    Omit<UpdateResultRequest, "id" | "sampleId">
  >({
    resultDate: "",
    conclusion: "",
    filePath: "",
  });
  const [selectedUpdateFile, setSelectedUpdateFile] = useState<File | null>(
    null
  );
  const [isUpdatingUploading, setIsUpdatingUploading] = useState(false);
  const [uploadedUpdateFilePath, setUploadedUpdateFilePath] = useState<
    string | null
  >(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateResultRequest>({
    sampleId: 0,
    resultDate: "",
    conclusion: "",
    filePath: "",
  });
  const [selectedCreateFile, setSelectedCreateFile] = useState<File | null>(
    null
  );
  const [isCreatingUploading, setIsCreatingUploading] = useState(false);
  const [uploadedCreateFilePath, setUploadedCreateFilePath] = useState<
    string | null
  >(null);

  const { data, isLoading, isError, error } = useQuery<GetAllResultsResponse>({
    queryKey: ["results"],
    queryFn: ({ signal }) => getAllResults({ signal }),
  });

  const deleteResultMutation = useMutation({
    mutationFn: deleteResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      alert("Xóa kết quả thành công!");
    },
    onError: (err) => {
      alert(`Lỗi xóa kết quả: ${err.message}`);
    },
  });

  const updateResultMutation = useMutation({
    mutationFn: updateResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      setShowUpdateModal(false);
      setSelectedResult(null);
      alert("Cập nhật kết quả thành công!");
    },
    onError: (err) => {
      alert(`Lỗi cập nhật kết quả: ${err.message}`);
    },
  });

  const createResultMutation = useMutation({
    mutationFn: createResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      setShowCreateModal(false);
      setCreateFormData({
        sampleId: 0,
        resultDate: "",
        conclusion: "",
        filePath: "",
      });
      alert("Thêm kết quả mới thành công!");
    },
    onError: (err) => {
      alert(`Lỗi thêm kết quả mới: ${err.message}`);
    },
  });

  const results = data?.result || [];

  const uploadPdfToCloudinary = async (file: File): Promise<string> => {
    const CLOUDINARY_CLOUD_NAME = "dku0qdaan"; // Replace with your Cloudinary cloud name
    const CLOUDINARY_UPLOAD_PRESET = "ADN_SWP"; // Replace with your Cloudinary upload preset

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

  const handleDeleteResult = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa kết quả này không?")) {
      deleteResultMutation.mutate(id.toString());
    }
  };

  const handleUpdateClick = (result: ResultItem) => {
    setSelectedResult(result);
    setUpdateFormData({
      resultDate: result.resultDate,
      conclusion: result.conclusion,
      filePath: result.filePath,
    });
    setSelectedUpdateFile(null);
    setUploadedUpdateFilePath(result.filePath);
    setShowUpdateModal(true);
  };

  const handleModalClose = () => {
    setShowUpdateModal(false);
    setSelectedResult(null);
    setSelectedUpdateFile(null);
    setUploadedUpdateFilePath(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateFileUpload = async (file: File) => {
    setIsUpdatingUploading(true);
    try {
      const url = await uploadPdfToCloudinary(file);
      setUploadedUpdateFilePath(url);
      setUpdateFormData((prev) => ({ ...prev, filePath: url }));
      alert("Tải lên tệp thành công!");
    } catch (err: any) {
      alert(`Lỗi tải lên tệp: ${err.message}`);
    } finally {
      setIsUpdatingUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResult || !uploadedUpdateFilePath) return;

    try {
      const payload: UpdateResultRequest = {
        id: selectedResult.id,
        sampleId: selectedResult.sampleId,
        resultDate: updateFormData.resultDate,
        conclusion: updateFormData.conclusion,
        filePath: uploadedUpdateFilePath,
      };
      updateResultMutation.mutate(payload);
    } catch (err: any) {
      alert(`Lỗi cập nhật kết quả: ${err.message}`);
    }
  };

  const handleCreateClick = () => {
    setCreateFormData({
      sampleId: 0,
      resultDate: "",
      conclusion: "",
      filePath: "",
    });
    setSelectedCreateFile(null);
    setUploadedCreateFilePath(null);
    setShowCreateModal(true);
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
    setSelectedCreateFile(null);
    setUploadedCreateFilePath(null);
  };

  const handleCreateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateFormData((prevData) => ({
      ...prevData,
      [name]: name === "sampleId" ? Number(value) : value,
    }));
  };

  const handleCreateFileUpload = async (file: File) => {
    setIsCreatingUploading(true);
    try {
      const url = await uploadPdfToCloudinary(file);
      setUploadedCreateFilePath(url);
      setCreateFormData((prev) => ({ ...prev, filePath: url }));
      alert("Tải lên tệp thành công!");
    } catch (err: any) {
      alert(`Lỗi tải lên tệp: ${err.message}`);
    } finally {
      setIsCreatingUploading(false);
    }
  };

  const handleCreateFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedCreateFilePath) return;

    try {
      const payload: CreateResultRequest = {
        ...createFormData,
        filePath: uploadedCreateFilePath,
      };

      createResultMutation.mutate(payload);
    } catch (err: any) {
      alert(`Lỗi tạo kết quả: ${err.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Quản lý kết quả xét nghiệm
          </h2>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thêm kết quả mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã kết quả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã mẫu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày kết quả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kết luận
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đường dẫn tệp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result: ResultItem) => (
              <tr key={result.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {result.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{result.sampleId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(result.resultDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {result.conclusion}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{result.filePath}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleUpdateClick(result)}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => handleDeleteResult(result.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={deleteResultMutation.isPending}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Result Modal */}
      {showUpdateModal && selectedResult && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/3">
            <h3 className="text-lg font-semibold mb-4">Cập nhật kết quả</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="resultDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ngày kết quả
                </label>
                <input
                  type="date"
                  id="resultDate"
                  name="resultDate"
                  value={
                    new Date(updateFormData.resultDate)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="conclusion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kết luận
                </label>
                <textarea
                  id="conclusion"
                  name="conclusion"
                  rows={3}
                  value={updateFormData.conclusion}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="filePath"
                  className="block text-sm font-medium text-gray-700"
                >
                  Đường dẫn tệp
                </label>
                <input
                  type="file"
                  id="filePath"
                  name="filePath"
                  onChange={(e) =>
                    setSelectedUpdateFile(
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {updateFormData.filePath &&
                  (selectedUpdateFile || updateFormData.filePath) && (
                    <a
                      href={updateFormData.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline mt-2 inline-block"
                    >
                      📄 Xem file hiện tại
                    </a>
                  )}
                <button
                  type="button"
                  onClick={() => handleUpdateFileUpload(selectedUpdateFile!)}
                  disabled={!selectedUpdateFile || isUpdatingUploading}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {isUpdatingUploading ? "Đang tải..." : "Tải lên file"}
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
                  disabled={
                    updateResultMutation.isPending || !uploadedUpdateFilePath
                  }
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Result Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/3">
            <h3 className="text-lg font-semibold mb-4">Thêm kết quả mới</h3>
            <form onSubmit={handleCreateFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="sampleId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mã mẫu
                </label>
                <input
                  type="number"
                  id="sampleId"
                  name="sampleId"
                  value={createFormData.sampleId}
                  onChange={handleCreateFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="createResultDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ngày kết quả
                </label>
                <input
                  type="date"
                  id="createResultDate"
                  name="resultDate"
                  value={createFormData.resultDate}
                  onChange={handleCreateFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="createConclusion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kết luận
                </label>
                <textarea
                  id="createConclusion"
                  name="conclusion"
                  rows={3}
                  value={createFormData.conclusion}
                  onChange={handleCreateFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="createFilePath"
                  className="block text-sm font-medium text-gray-700"
                >
                  Đường dẫn tệp
                </label>
                <input
                  type="file"
                  id="createFilePath"
                  name="filePath"
                  onChange={(e) =>
                    setSelectedCreateFile(
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
                {uploadedCreateFilePath && (
                  <a
                    href={uploadedCreateFilePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mt-2 inline-block"
                  >
                    📄 Xem file đã tải lên
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleCreateFileUpload(selectedCreateFile!)}
                  disabled={!selectedCreateFile || isCreatingUploading}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {isCreatingUploading ? "Đang tải..." : "Tải lên file"}
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
                  disabled={
                    createResultMutation.isPending || !uploadedCreateFilePath
                  }
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

export default ResultManagement;
