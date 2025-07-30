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
  type Participant,
} from "../Services/SampleService/CreateSample";
import {
  getSampleByTestOrder,
  type SampleByTestOrderItem,
  type GetSampleByTestOrderResponse,
} from "../Services/SampleService/GetSampleByTestOrder";
import {
  createLocusResult,
  type CreateLocusResultRequest,
  type LocusAllele,
} from "../Services/LocusResultService/CreateLocusResult";
import { getLocusResultById, type GetLocusResultByIdResponse } from "../Services/LocusResultService/GetLocusResultById";
import { getLocusResultBySampleId, type GetLocusResultBySampleIdResponse } from "../Services/LocusResultService/GetLocusResultBySampleId";
import { updateLocusResult } from "../Services/LocusResultService/UpdateLocusResult";
import { useGetAllSampleMethods } from "../Services/SampleMethodService/GetAllSampleMethods";

function useHasLocus(sampleId: number) {
  const { data } = useQuery({
    queryKey: ["locusBySample", sampleId],
    queryFn: () => getLocusResultBySampleId({ sampleId }),
    enabled: !!sampleId,
    refetchOnWindowFocus: true,
    staleTime: 0, // Luôn fetch lại khi có thay đổi
  });
  return data && Array.isArray(data.result) && data.result.length > 0;
}

function LocusActionCell({ sample, handleShowLocusModal, handleShowLocusDetail, handleShowUpdateLocusModal }: { sample: any, handleShowLocusModal: (sample: any) => void, handleShowLocusDetail: (id: number) => void, handleShowUpdateLocusModal: (sample: any) => void }) {
  const hasLocus = useHasLocus(sample.id);
  return (
    <>
      {!hasLocus ? (
        <button
          onClick={() => handleShowLocusModal(sample)}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 mr-2"
        >
          Thêm Locus
        </button>
      ) : (
        <button
          onClick={() => handleShowUpdateLocusModal(sample)}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
        >
          Cập nhật Locus
        </button>
      )}
      <button
        onClick={() => handleShowLocusDetail(sample.id)}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Xem chi tiết Locus
      </button>
    </>
  );
}

const SampleManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState<number | "all">("all");
  const [selectedResult, setSelectedResult] = useState<SampleItem | null>(null);
  const [selectedTestOrderId, setSelectedTestOrderId] = useState<number | null>(null);
  const [updateFormData, setUpdateFormData] = useState<UpdateResultRequest>({
    id: 0,
    testOrderId: 0,
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
    });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateSampleRequest>({
    testOrderId: 0,
    participants: [
      {
        collectionDate: "",
        sampleStatus: 1,
        notes: "",
        participantName: "",
        relationship: "",
        sampleTypeId: 0,
        fingerprintImagePath: "",
      },
    ],
  });

  // Locus Result states
  const [showLocusModal, setShowLocusModal] = useState(false);
  const [selectedSampleForLocus, setSelectedSampleForLocus] = useState<SampleItem | null>(null);
  const [locusRefreshKey, setLocusRefreshKey] = useState(0); // Thêm state để force refresh
  const [locusFormData, setLocusFormData] = useState<CreateLocusResultRequest>({
    sampleId: 0,
    locusAlleles: [
      { locusName: "D3S1358", firstAllele: "", secondAllele: "" },
      { locusName: "VWA", firstAllele: "", secondAllele: "" },
      { locusName: "FGA", firstAllele: "", secondAllele: "" },
      { locusName: "TH01", firstAllele: "", secondAllele: "" },
      { locusName: "D8S1179", firstAllele: "", secondAllele: "" },
    ],
  });
  const [isUpdateLocus, setIsUpdateLocus] = useState(false);

  // Locus Detail states
  const [showLocusDetailModal, setShowLocusDetailModal] = useState(false);
  const [locusDetailSampleId, setLocusDetailSampleId] = useState<number | null>(null);
  const [locusDetailData, setLocusDetailData] = useState<GetLocusResultBySampleIdResponse | null>(null);
  const [isLoadingLocusDetail, setIsLoadingLocusDetail] = useState(false);
  const [locusDetailError, setLocusDetailError] = useState<string | null>(null);

  const handleShowLocusDetail = async (sampleId: number) => {
    setShowLocusDetailModal(true);
    setLocusDetailSampleId(sampleId);
    setIsLoadingLocusDetail(true);
    setLocusDetailError(null);
    try {
      const data = await getLocusResultBySampleId({ sampleId });
      setLocusDetailData(data);
    } catch (err: any) {
      setLocusDetailError(err.message || "Lỗi khi lấy chi tiết locus");
    } finally {
      setIsLoadingLocusDetail(false);
    }
  };

  const handleCloseLocusDetailModal = () => {
    setShowLocusDetailModal(false);
    setLocusDetailSampleId(null);
    setLocusDetailData(null);
    setLocusDetailError(null);
  };

  const queryClient = useQueryClient();

  // Gọi API lấy danh sách mẫu xét nghiệm, lọc theo trạng thái
  const { data, isLoading, isError, error } = useQuery<GetAllSamplesResponse>({
    queryKey: ["samples", selectedStatus],
    queryFn: ({ signal }) =>
      getAllSamples({
        signal,
        sampleStatus: selectedStatus,
      }),
  });

  // Query để lấy samples theo testOrderId
  const {
    data: samplesByTestOrder,
    isLoading: isLoadingSamplesByTestOrder,
    isError: isErrorSamplesByTestOrder,
    error: errorSamplesByTestOrder,
  } = useQuery<GetSampleByTestOrderResponse>({
    queryKey: ["samplesByTestOrder", selectedTestOrderId],
    queryFn: ({ signal }) => {
      console.log("Calling getSampleByTestOrder with testOrderId:", selectedTestOrderId);
      return getSampleByTestOrder({
        signal,
        testOrderId: selectedTestOrderId!,
      });
    },
    enabled: !!selectedTestOrderId, // Chỉ chạy khi có selectedTestOrderId
    retry: 1, // Retry 1 lần nếu lỗi
    retryDelay: 1000, // Delay 1 giây trước khi retry
  });

  // Function để handle search
  const handleSearchByTestOrderId = () => {
    if (selectedTestOrderId) {
      console.log("Searching for test order ID:", selectedTestOrderId);
      // Force refetch the query
      queryClient.invalidateQueries({ queryKey: ["samplesByTestOrder", selectedTestOrderId] });
    }
  };

  // Function để clear search
  const handleClearSearch = () => {
    setSelectedTestOrderId(null);
  };

  // Mutation xóa mẫu xét nghiệm
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

  // Mutation cập nhật mẫu xét nghiệm
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

  // Mutation tạo mới mẫu xét nghiệm
  const createSampleMutation = useMutation({
    mutationFn: createSample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
      setShowCreateModal(false);
      setCreateFormData({
        testOrderId: 0,
        participants: [
          {
            collectionDate: "",
            sampleStatus: 1,
            notes: "",
            participantName: "",
            relationship: "",
            sampleTypeId: 0,
            fingerprintImagePath: "",
          },
        ],
      });
      alert("Tạo mẫu mới thành công!");
    },
    onError: (err) => {
      alert(`Lỗi tạo mẫu mới: ${err.message}`);
    },
  });

  const createLocusResultMutation = useMutation({
    mutationFn: createLocusResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
      // Thêm invalidate cho locusBySample queries để refresh button state
      queryClient.invalidateQueries({ queryKey: ["locusBySample"] });
      setLocusRefreshKey(prev => prev + 1); // Force re-render
      setShowLocusModal(false);
      setSelectedSampleForLocus(null);
      alert("Thêm locus result thành công!");
    },
    onError: (err) => {
      alert(`Lỗi thêm locus result: ${err.message}`);
    },
  });

  const samples = data?.result || [];
  const samplesByTestOrderData = samplesByTestOrder?.result || [];
  const { data: sampleMethodsData } = useGetAllSampleMethods();
  const sampleMethods = sampleMethodsData?.result || [];
  const [selectedMethod, setSelectedMethod] = useState<number | "all">("all");

  // Xử lý phân trang cho bảng mẫu xét nghiệm
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = samples.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedSamples = samples.slice(startIndex, endIndex);

  // Hàm chuyển trang
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Hàm render các nút số trang
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 border rounded-md ${currentPage === i ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
        >
          {i}
        </button>
      );
    }
    return pages;
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

  const handleDeleteSample = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mẫu này không?")) {
      deleteSampleMutation.mutate(id);
    }
  };

  const handleUpdateResult = (sample: SampleItem) => {
    setSelectedResult(sample);
    setUpdateFormData({
      id: sample.result?.id || 0,
      testOrderId: sample.testOrder.id || 0,
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
      testOrderId: sample.testOrder.id || 0,
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
      testOrderId: 0,
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
      testOrderId: 0,
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
        testOrderId: updateFormData.testOrderId,
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
        name === "sampleStatus"
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
      participants: [
        {
          collectionDate: "",
          sampleStatus: 1,
          notes: "",
          participantName: "",
          relationship: "",
          sampleTypeId: 0,
          fingerprintImagePath: "",
        },
      ],
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
      [name]: name === "testOrderId" ? Number(value) : value,
    }));
  };

  const handleCreateFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSampleMutation.mutate(createFormData);
  };

  // Locus Result handlers
  const handleShowLocusModal = (sample: SampleItem) => {
    setSelectedSampleForLocus(sample);
    setLocusFormData({
      sampleId: sample.id,
      locusAlleles: [
        { locusName: "D3S1358", firstAllele: "", secondAllele: "" },
        { locusName: "VWA", firstAllele: "", secondAllele: "" },
        { locusName: "FGA", firstAllele: "", secondAllele: "" },
        { locusName: "TH01", firstAllele: "", secondAllele: "" },
        { locusName: "D8S1179", firstAllele: "", secondAllele: "" },
      ],
    });
    setShowLocusModal(true);
  };

  const handleShowUpdateLocusModal = async (sample: SampleItem) => {
    setSelectedSampleForLocus(sample);
    setIsUpdateLocus(true);
    // Lấy dữ liệu locus hiện tại
    const data = await getLocusResultBySampleId({ sampleId: sample.id });
    setLocusFormData({
      sampleId: sample.id,
      locusAlleles: data.result.map((locus: any) => ({
        locusName: locus.locusName,
        firstAllele: locus.firstAllele,
        secondAllele: locus.secondAllele,
      })),
    });
    setShowLocusModal(true);
  };

  const handleLocusModalClose = () => {
    setShowLocusModal(false);
    setSelectedSampleForLocus(null);
    setIsUpdateLocus(false);
  };

  const handleLocusFormChange = (index: number, field: 'firstAllele' | 'secondAllele', value: string) => {
    setLocusFormData(prev => ({
      ...prev,
      locusAlleles: prev.locusAlleles.map((locus, i) => 
        i === index ? { ...locus, [field]: value } : locus
      ),
    }));
  };

  const handleLocusFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Kiểm tra xem có ít nhất một locus được nhập đầy đủ
    const hasValidLocus = locusFormData.locusAlleles.some(
      locus => locus.firstAllele.trim() !== "" && locus.secondAllele.trim() !== ""
    );
    
    if (!hasValidLocus) {
      alert("Vui lòng nhập ít nhất một locus với đầy đủ thông tin!");
      return;
    }

    // Lọc ra các locus có đầy đủ thông tin
    const validLocusAlleles = locusFormData.locusAlleles.filter(
      locus => locus.firstAllele.trim() !== "" && locus.secondAllele.trim() !== ""
    );

    const payload = {
      ...locusFormData,
      locusAlleles: validLocusAlleles,
    };

    if (isUpdateLocus) {
      // Gọi update
      try {
        await updateLocusResult(locusFormData.sampleId, payload);
        queryClient.invalidateQueries({ queryKey: ["samples"] });
        // Thêm invalidate cho locusBySample queries để refresh button state
        queryClient.invalidateQueries({ queryKey: ["locusBySample"] });
        setLocusRefreshKey(prev => prev + 1); // Force re-render
        setShowLocusModal(false);
        setSelectedSampleForLocus(null);
        setIsUpdateLocus(false);
        alert("Cập nhật locus result thành công!");
      } catch (err: any) {
        alert(err.message || "Lỗi cập nhật locus result!");
      }
    } else {
      createLocusResultMutation.mutate(payload);
    }
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
              value={selectedMethod}
              onChange={(e) =>
                setSelectedMethod(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                )
              }
            >
              <option value="all">Tất cả phương thức lấy mẫu</option>
              {sampleMethods.map((method) => (
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
              <option value={0}>Chờ xử lý</option>
              <option value={1}>Đang xử lý</option>
              <option value={2}>Hoàn thành</option>
              <option value={3}>Đã hủy</option>
            </select>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Nhập ID đơn hẹn"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTestOrderId || ""}
                onChange={(e) => setSelectedTestOrderId(e.target.value ? Number(e.target.value) : null)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && selectedTestOrderId) {
                    handleSearchByTestOrderId();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSearchByTestOrderId}
                disabled={!selectedTestOrderId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
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
                Người lấy mẫu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ghi chú
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn vị vận chuyển
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã vận đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại mẫu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh vân tay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thêm Locus
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Hiển thị samples theo testOrderId nếu có */}
            {selectedTestOrderId && samplesByTestOrderData.length > 0 ? (
              samplesByTestOrderData.map((sample: SampleByTestOrderItem) => {
                return (
                  <tr key={sample.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sample.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sample.sampleCode || sample.id}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sample.shippingProvider || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sample.trackingNumber || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sample.sampleType ? sample.sampleType.name : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sample.fingerprintImagePath ? (
                          <img 
                            src={sample.fingerprintImagePath} 
                            alt="Fingerprint" 
                            className="w-16 h-12 object-cover rounded border"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">Không có</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <LocusActionCell
                        key={`locus-${sample.id}-${locusRefreshKey}`}
                        sample={sample}
                        handleShowLocusModal={handleShowLocusModal}
                        handleShowLocusDetail={handleShowLocusDetail}
                        handleShowUpdateLocusModal={handleShowUpdateLocusModal}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
              })
            ) : selectedTestOrderId && isLoadingSamplesByTestOrder ? (
              <tr>
                <td colSpan={14} className="px-6 py-4 text-center text-gray-600">
                  Đang tải dữ liệu theo đơn hẹn...
                </td>
              </tr>
            ) : selectedTestOrderId && isErrorSamplesByTestOrder ? (
              <tr>
                <td colSpan={14} className="px-6 py-4 text-center text-red-600">
                  <div className="mb-2">
                    <strong>Lỗi khi tìm kiếm mẫu cho đơn hẹn {selectedTestOrderId}:</strong>
                  </div>
                  <div className="text-sm text-red-500 mb-2">
                    {errorSamplesByTestOrder?.message || "Không thể kết nối đến server"}
                  </div>
                  <div className="text-xs text-gray-500">
                    Vui lòng kiểm tra lại ID đơn hẹn hoặc thử lại sau. 
                    Nếu vấn đề vẫn tiếp tục, hãy liên hệ admin.
                  </div>
                </td>
              </tr>
            ) : selectedTestOrderId && samplesByTestOrderData.length === 0 ? (
              <tr>
                <td colSpan={14} className="px-6 py-4 text-center text-gray-600">
                  <div className="mb-2">Không tìm thấy mẫu nào cho đơn hẹn {selectedTestOrderId}</div>
                  <div className="text-sm text-gray-500">Vui lòng kiểm tra lại ID đơn hẹn</div>
                </td>
              </tr>
            ) : (
              // Hiển thị tất cả samples nếu không có filter
              paginatedSamples.map((sample: SampleItem) => {
                return (
                  <tr key={sample.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sample.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sample.sampleCode || sample.id}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sample.shippingProvider || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sample.trackingNumber || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sample.sampleType ? sample.sampleType.name : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sample.fingerprintImagePath ? (
                          <img 
                            src={sample.fingerprintImagePath} 
                            alt="Fingerprint" 
                            className="w-16 h-12 object-cover rounded border"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">Không có</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <LocusActionCell
                        key={`locus-${sample.id}-${locusRefreshKey}`}
                        sample={sample}
                        handleShowLocusModal={handleShowLocusModal}
                        handleShowLocusDetail={handleShowLocusDetail}
                        handleShowUpdateLocusModal={handleShowUpdateLocusModal}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Thêm phân trang dưới bảng */}
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
                    value={(sampleEditFormData.collectionDate || "").slice(0, 16)}
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
                    value={(sampleEditFormData.receivedDate || "").slice(0, 16)}
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
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thông tin người tham gia
                </label>
                <div className="text-sm text-gray-500">
                  Vui lòng sử dụng chức năng "Thêm mẫu xét nghiệm" từ trang Quản lý đơn hẹn để thêm thông tin người tham gia.
                </div>
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

      {/* Locus Result Modal */}
      {showLocusModal && selectedSampleForLocus && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-3/4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Thêm Locus Result cho mẫu {selectedSampleForLocus.id}</h3>
            <form onSubmit={handleLocusFormSubmit}>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Nhập thông tin allele cho từng locus. Chỉ những locus có đầy đủ thông tin sẽ được gửi.
                </p>
              </div>
              
              <div className="space-y-4">
                {locusFormData.locusAlleles.map((locus, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{locus.locusName}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Allele
                        </label>
                        <input
                          type="text"
                          value={locus.firstAllele}
                          onChange={(e) => handleLocusFormChange(index, 'firstAllele', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="VD: 15"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Second Allele
                        </label>
                        <input
                          type="text"
                          value={locus.secondAllele}
                          onChange={(e) => handleLocusFormChange(index, 'secondAllele', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="VD: 17"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleLocusModalClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  disabled={createLocusResultMutation.isPending}
                >
                  {createLocusResultMutation.isPending ? "Đang thêm..." : "Thêm Locus Result"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Locus Detail Modal */}
      {showLocusDetailModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-2/3 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Chi tiết Locus cho sample ID {locusDetailSampleId}</h3>
            {isLoadingLocusDetail ? (
              <div className="text-center py-8 text-gray-600">Đang tải dữ liệu...</div>
            ) : locusDetailError ? (
              <div className="text-center py-8 text-red-600">{locusDetailError}</div>
            ) : locusDetailData && locusDetailData.result.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 mb-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locus</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Allele</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Second Allele</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {locusDetailData.result.map((locus: any, idx: number) => (
                    <tr key={locus.id || idx}>
                      <td className="px-4 py-2">{locus.locusName}</td>
                      <td className="px-4 py-2">{locus.firstAllele}</td>
                      <td className="px-4 py-2">{locus.secondAllele}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">Không có dữ liệu locus cho sample này.</div>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleCloseLocusDetailModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
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
