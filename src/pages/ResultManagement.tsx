import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllResults, type GetAllResultsResponse, type ResultItem } from '../Services/ResultService/GetAllResults';
import { createResult, type CreateResultRequest } from '../Services/ResultService/CreateResult';
import { updateResult, type UpdateResultRequest } from '../Services/ResultService/UpdateResult';
import { deleteResult } from '../Services/ResultService/DeleteResult';
import { getTestOrderById } from '../Services/TestOrderService/GetTestOrderById';
import { uploadFile } from '../Services/FileService/UploadFile';
import { downloadAndOpenFile } from '../Services/FileService/DownloadFile';
import { apiLinks } from '../Services/MainService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function AdnReportPreview({ data }: { data: any }) {
  if (!data) return null;
  // Chuẩn hóa dữ liệu
  const samples = data.samples || [];
  // Lấy danh sách locus duy nhất, theo thứ tự xuất hiện ở mẫu đầu tiên (nếu có)
  let locusNames: string[] = [];
  if (samples.length > 0) {
    locusNames = samples[0].locusResults.map((l: any) => l.locusName);
  }
  // Map locusName -> { [sampleCode]: {firstAllele, secondAllele} }
  const locusTable: Record<string, Record<string, {firstAllele: string, secondAllele: string}>> = {};
  locusNames.forEach(locus => {
    locusTable[locus] = {};
    samples.forEach(sample => {
      const found = (sample.locusResults || []).find((l: any) => l.locusName === locus);
      locusTable[locus][sample.sampleCode] = found ? { firstAllele: found.firstAllele, secondAllele: found.secondAllele } : { firstAllele: "-", secondAllele: "-" };
    });
  });
  return (
    <div className="text-sm text-gray-900">
      <h2 className="text-xl font-bold mb-2 text-center">Mẫu báo cáo xét nghiệm ADN huyết thống</h2>
      <div className="mb-2">
        <div className="font-semibold">TRUNG TÂM XÉT NGHIỆM DI TRUYỀN GENETICLAB</div>
        <div>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</div>
        <div>Hotline: 1900 123 456 | Website: www.geneticlab.vn</div>
      </div>
      <div className="mb-2">
        <div className="font-semibold">PHIẾU KẾT QUẢ XÉT NGHIỆM ADN HUYẾT THỐNG</div>
        <div>Ngày xét nghiệm: {data.appointmentDate ? new Date(data.appointmentDate).toLocaleDateString() : "-"}</div>
      </div>
      <div className="mb-2">
        <div className="font-semibold">Thông tin mẫu xét nghiệm:</div>
        <table className="w-full border mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Mẫu</th>
              <th className="border px-2 py-1">Mã mẫu</th>
              <th className="border px-2 py-1">Người gửi mẫu</th>
              <th className="border px-2 py-1">Mối quan hệ</th>
              <th className="border px-2 py-1">Ngày lấy mẫu</th>
            </tr>
          </thead>
          <tbody>
            {samples.map((s: any, idx: number) => (
              <tr key={idx}>
                <td className="border px-2 py-1">Mẫu {idx + 1}</td>
                <td className="border px-2 py-1">{s.sampleCode || "-"}</td>
                <td className="border px-2 py-1">{s.participantName || "-"}</td>
                <td className="border px-2 py-1">{s.relationship || "-"}</td>
                <td className="border px-2 py-1">{s.collectionDate ? new Date(s.collectionDate).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-2">
        <div className="font-semibold">Kết quả phân tích locus và allele:</div>
        <table className="w-full border mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">STT</th>
              <th className="border px-2 py-1">Locus</th>
              {samples.map((s: any, idx: number) => (
                <th key={idx} className="border px-2 py-1">{s.sampleCode || `Mẫu ${idx + 1}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {locusNames.map((locus, idx) => (
              <tr key={locus}>
                <td className="border px-2 py-1">{idx + 1}</td>
                <td className="border px-2 py-1">{locus}</td>
                {samples.map((s: any, sidx: number) => (
                  <td key={sidx} className="border px-2 py-1">{locusTable[locus][s.sampleCode].firstAllele}, {locusTable[locus][s.sampleCode].secondAllele}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-2">
        <div className="font-semibold">Kết luận:</div>
        <div>{data.conclusion || "-"}</div>
      </div>
    </div>
  );
}

const ResultManagement = () => {
  const queryClient = useQueryClient();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any | null>(null);
  const [updateFormData, setUpdateFormData] = useState({
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
  const [createFormData, setCreateFormData] = useState({
    testOrderId: 0,
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

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTestOrderId, setExportTestOrderId] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [testOrderPreview, setTestOrderPreview] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["results"],
    queryFn: ({ signal }) => getAllResults({ signal }),
  });

  const parseErrorMessage = (err: any) => {
    if (err?.data?.result) return err.data.result;
    // Nếu message là JSON hoặc có prefix "Error: "
    if (err?.message && typeof err.message === "string") {
      let msg = err.message.trim();
      // Nếu có prefix "Error: ", cắt bỏ
      if (msg.startsWith("Error: ")) {
        msg = msg.slice(7);
      }
      if (msg.startsWith("{") && msg.endsWith("}")) {
        try {
          const parsed = JSON.parse(msg);
          return (
            parsed.result ||
            parsed.errorMessage ||
            parsed.message ||
            "Lỗi không xác định"
          );
        } catch {
          return err.message;
        }
      }
      return msg;
    }
    return "Lỗi không xác định";
  };

  // Hàm xử lý xóa kết quả xét nghiệm, gọi mutation xóa và cập nhật lại danh sách
  const deleteResultMutation = useMutation({
    mutationFn: deleteResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      alert("Xóa kết quả thành công!");
    },
    onError: (err) => {
      alert(parseErrorMessage(err));
    },
  });

  // Hàm xử lý cập nhật kết quả xét nghiệm, gọi mutation cập nhật và cập nhật lại danh sách
  const updateResultMutation = useMutation({
    mutationFn: updateResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      setShowUpdateModal(false);
      setSelectedResult(null);
      alert("Cập nhật kết quả thành công!");
    },
    onError: (err) => {
      alert(parseErrorMessage(err));
    },
  });

  // Hàm xử lý tạo mới kết quả xét nghiệm
  const createResultMutation = useMutation({
    mutationFn: createResult,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      setShowCreateModal(false);
      setCreateFormData({
        testOrderId: 0,
        resultDate: "",
        conclusion: "",
        filePath: "",
      });
      alert(data.result || "Thêm kết quả mới thành công!");
    },
    onError: (err) => {
      alert(parseErrorMessage(err));
    },
  });

  const results = data?.result || [];

  const uploadPdfFile = async (file: File): Promise<string> => {
    // Kiểm tra file
    if (!file) {
      throw new Error("Không có file được chọn");
    }

    // Kiểm tra loại file
    if (file.type !== "application/pdf") {
      throw new Error("Chỉ chấp nhận file PDF");
    }

    // Kiểm tra kích thước file (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File quá lớn. Kích thước tối đa là 10MB");
    }

    try {
      // Thử upload lên backend trước
      console.log("Trying backend upload...");
      return await uploadToBackend(file);
    } catch (backendError) {
      console.error("Backend upload failed:", backendError);
      
      // Fallback: Thử Cloudinary
      try {
        console.log("Trying Cloudinary upload...");
        return await uploadPdfToCloudinary(file);
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed:", cloudinaryError);
        
        // Fallback cuối cùng: Local storage
        console.log("Using local storage fallback...");
        return await uploadToLocalStorage(file);
      }
    }
  };

  // Upload to backend API
  const uploadToBackend = async (file: File): Promise<string> => {
    try {
      console.log("Uploading to backend API...");
      const response = await uploadFile(file);
      
      if (response.fileName && response.path) {
        console.log("Backend upload successful:", response);
        // Tạo URL download từ fileName
        return apiLinks.Files.download(response.fileName);
      } else {
        throw new Error("Upload failed - invalid response");
      }
    } catch (error) {
      console.error("Backend upload error:", error);
      throw error;
    }
  };

  // Upload to Cloudinary (fallback)
  const uploadPdfToCloudinary = async (file: File): Promise<string> => {
    const CLOUDINARY_CLOUD_NAME = "dku0qdaan";
    const CLOUDINARY_UPLOAD_PRESET = "ADN_SWP";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("resource_type", "raw");
    formData.append("public_id", `pdf_${Date.now()}_${file.name.replace('.pdf', '')}`);
    formData.append("access_mode", "public");
    formData.append("invalidate", "1");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Cloudinary upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  };

  // Extract fileName from URL
  const extractFileNameFromUrl = (url: string): string => {
    try {
      // Nếu là URL backend
      if (url.includes('/api/Files/download/')) {
        return url.split('/api/Files/download/')[1];
      }
      
      // Nếu là URL Cloudinary
      if (url.includes('cloudinary.com')) {
        const parts = url.split('/');
        const fileName = parts[parts.length - 1];
        return fileName || 'unknown.pdf';
      }
      
      // Nếu là data URL
      if (url.startsWith('data:')) {
        return `file_${Date.now()}.pdf`;
      }
      
      return 'unknown.pdf';
    } catch (error) {
      return 'unknown.pdf';
    }
  };

  // Download file from URL using DownloadFile.ts API
  const downloadFileFromUrl = async (url: string, resultId: number) => {
    try {
      // Nếu là URL backend
      if (url.includes('/api/Files/download/')) {
        const fileName = extractFileNameFromUrl(url);
        console.log("Downloading file using DownloadFile.ts API:", fileName);
        
        // Gọi API DownloadFile.ts
        await downloadAndOpenFile(fileName, `result-${resultId}.pdf`);
        console.log("File downloaded successfully using DownloadFile.ts API");
        return;
      }
      
      // Nếu là URL Cloudinary hoặc data URL
      console.log("Downloading file from external URL:", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Không thể tải file');
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `result-${resultId}.pdf`;
      link.target = '_blank';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log("File downloaded successfully from external URL");
    } catch (error) {
      console.error("Download file error:", error);
      alert("Không thể tải xuống file");
    }
  };

  // Fallback: Upload to local storage
  const uploadToLocalStorage = async (file: File): Promise<string> => {
    try {
      // Tạo URL cho file
      const fileUrl = URL.createObjectURL(file);
      
      // Lưu file vào localStorage (chỉ cho demo, không khuyến khích cho production)
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          try {
            // Tạo unique ID cho file
            const fileId = `pdf_${Date.now()}_${file.name}`;
            
            // Lưu file data vào localStorage
            localStorage.setItem(fileId, reader.result as string);
            
            // Trả về URL có thể truy cập
            const localUrl = `data:application/pdf;base64,${btoa(reader.result as string)}`;
            console.log("File saved to local storage:", fileId);
            resolve(localUrl);
          } catch (err) {
            reject(new Error("Không thể lưu file vào local storage"));
          }
        };
        reader.onerror = () => reject(new Error("Không thể đọc file"));
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error("Local storage upload error:", error);
      throw new Error("Không thể upload file");
    }
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
      deleteResultMutation.mutate(id);
    }
  };



  const handleUpdateClick = (result: any) => {
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

  // Hàm upload file PDF lên server hoặc Cloudinary (nếu backend lỗi)
  const handleUpdateFileUpload = async (file: File) => {
    // Kiểm tra file
    if (!file) {
      alert("Không có file được chọn");
      return;
    }

    // Kiểm tra loại file
    if (file.type !== "application/pdf") {
      alert("Chỉ chấp nhận file PDF");
      return;
    }

    // Kiểm tra kích thước file (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File quá lớn. Kích thước tối đa là 10MB");
      return;
    }

    setIsUpdatingUploading(true);
    try {
      // Gọi trực tiếp API UploadFile.ts
      console.log("Calling UploadFile.ts API for update...");
      const response = await uploadFile(file);
      
      if (response.fileName && response.path) {
        console.log("UploadFile.ts API successful for update:", response);
        // Tạo URL download từ fileName
        const downloadUrl = apiLinks.Files.download(response.fileName);
        
        setUploadedUpdateFilePath(downloadUrl);
        setUpdateFormData((prev) => ({ ...prev, filePath: downloadUrl }));
        alert("Tải lên tệp thành công!");
      } else {
        throw new Error("Upload failed - invalid response");
      }
    } catch (err: any) {
      console.error("UploadFile.ts API error for update:", err);
      
      // Fallback: Thử Cloudinary nếu backend API thất bại
      try {
        console.log("Backend API failed for update, trying Cloudinary fallback...");
        const cloudinaryUrl = await uploadPdfToCloudinary(file);
        setUploadedUpdateFilePath(cloudinaryUrl);
        setUpdateFormData((prev) => ({ ...prev, filePath: cloudinaryUrl }));
        alert("Tải lên tệp thành công (Cloudinary)!");
      } catch (cloudinaryErr: any) {
        console.error("Cloudinary fallback also failed for update:", cloudinaryErr);
        alert(`Lỗi tải lên tệp: ${err.message}`);
      }
    } finally {
      setIsUpdatingUploading(false);
    }
  };

  // Hàm submit form cập nhật kết quả
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResult || !uploadedUpdateFilePath) return;

    try {
      const payload = {
        id: selectedResult.id,
        testOrderId: selectedResult.testOrderId,
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
      testOrderId: 0,
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
      [name]: name === "testOrderId" ? Number(value) : value,
    }));
  };

  const handleCreateFileUpload = async (file: File) => {
    console.log("Starting file upload for create form", file);
    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });
    
    // Kiểm tra file
    if (!file) {
      alert("Không có file được chọn");
      return;
    }

    // Kiểm tra loại file
    if (file.type !== "application/pdf") {
      alert("Chỉ chấp nhận file PDF");
      return;
    }

    // Kiểm tra kích thước file (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File quá lớn. Kích thước tối đa là 10MB");
      return;
    }
    
    setIsCreatingUploading(true);
    try {
      // Gọi trực tiếp API UploadFile.ts
      console.log("Calling UploadFile.ts API...");
      const response = await uploadFile(file);
      
      if (response.fileName && response.path) {
        console.log("UploadFile.ts API successful:", response);
        // Tạo URL download từ fileName
        const downloadUrl = apiLinks.Files.download(response.fileName);
        
        setUploadedCreateFilePath(downloadUrl);
        setCreateFormData((prev) => ({ ...prev, filePath: downloadUrl }));
        alert("Tải lên tệp thành công!");
      } else {
        throw new Error("Upload failed - invalid response");
      }
    } catch (err: any) {
      console.error("UploadFile.ts API error:", err);
      
      // Fallback: Thử Cloudinary nếu backend API thất bại
      try {
        console.log("Backend API failed, trying Cloudinary fallback...");
        const cloudinaryUrl = await uploadPdfToCloudinary(file);
        setUploadedCreateFilePath(cloudinaryUrl);
        setCreateFormData((prev) => ({ ...prev, filePath: cloudinaryUrl }));
        alert("Tải lên tệp thành công (Cloudinary)!");
      } catch (cloudinaryErr: any) {
        console.error("Cloudinary fallback also failed:", cloudinaryErr);
        alert(`Lỗi tải lên tệp: ${err.message}`);
      }
    } finally {
      setIsCreatingUploading(false);
    }
  };

  const handleCreateFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", { createFormData, uploadedCreateFilePath });

    if (!uploadedCreateFilePath) {
      alert("Vui lòng tải lên file trước khi thêm kết quả!");
      return;
    }

    try {
      const payload: any = {
        ...createFormData,
        filePath: uploadedCreateFilePath,
      };

      console.log("Submitting payload:", payload);
      createResultMutation.mutate(payload);
    } catch (err: any) {
      alert(`Lỗi tạo kết quả: ${err.message.result.data}`);
    }
  };

  const handleExportPDF = () => {
    setShowExportModal(true);
  };

  const handleExportModalClose = () => {
    setShowExportModal(false);
    setExportTestOrderId("");
  };

  const handleExportConfirm = async () => {
    if (!testOrderPreview) return;
    
    setIsExporting(true);
    try {
      // Tạo một div ẩn để render nội dung PDF
      const pdfContent = document.createElement('div');
      pdfContent.style.position = 'absolute';
      pdfContent.style.left = '-9999px';
      pdfContent.style.width = '800px';
      pdfContent.style.padding = '20px';
      pdfContent.style.fontSize = '12px';
      pdfContent.style.fontFamily = 'Arial, sans-serif';
      pdfContent.style.backgroundColor = 'white';
      pdfContent.style.color = 'black';
      
      // Tạo nội dung HTML cho PDF
      const samples = testOrderPreview.samples || [];
      let locusNames: string[] = [];
      if (samples.length > 0) {
        locusNames = samples[0].locusResults.map((l: any) => l.locusName);
      }
      
      const locusTable: Record<string, Record<string, {firstAllele: string, secondAllele: string}>> = {};
      locusNames.forEach(locus => {
        locusTable[locus] = {};
        samples.forEach((sample: any) => {
          const found = (sample.locusResults || []).find((l: any) => l.locusName === locus);
          locusTable[locus][sample.sampleCode] = found ? { firstAllele: found.firstAllele, secondAllele: found.secondAllele } : { firstAllele: "-", secondAllele: "-" };
        });
      });

      pdfContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">MẪU BÁO CÁO XÉT NGHIỆM ADN HUYẾT THỐNG</h1>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 5px;">TRUNG TÂM XÉT NGHIỆM DI TRUYỀN GENETICLAB</div>
          <div>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</div>
          <div>Hotline: 1900 123 456 | Website: www.geneticlab.vn</div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 5px;">PHIẾU KẾT QUẢ XÉT NGHIỆM ADN HUYẾT THỐNG</div>
          <div>Ngày xét nghiệm: ${testOrderPreview.appointmentDate ? new Date(testOrderPreview.appointmentDate).toLocaleDateString() : "-"}</div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 5px;">Thông tin mẫu xét nghiệm:</div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">Mẫu</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">Mã mẫu</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">Người gửi mẫu</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">Mối quan hệ</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">Ngày lấy mẫu</th>
              </tr>
            </thead>
            <tbody>
              ${samples.map((s: any, idx: number) => `
                <tr>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">Mẫu ${idx + 1}</td>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">${s.sampleCode || "-"}</td>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">${s.participantName || "-"}</td>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">${s.relationship || "-"}</td>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">${s.collectionDate ? new Date(s.collectionDate).toLocaleDateString() : "-"}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 5px;">Kết quả phân tích locus và allele:</div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">STT</th>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">Locus</th>
                ${samples.map((s: any, idx: number) => `
                  <th style="border: 1px solid #000; padding: 5px; text-align: center;">${s.sampleCode || `Mẫu ${idx + 1}`}</th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${locusNames.map((locus, idx) => `
                <tr>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">${idx + 1}</td>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">${locus}</td>
                  ${samples.map((s: any) => `
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">${locusTable[locus][s.sampleCode].firstAllele}, ${locusTable[locus][s.sampleCode].secondAllele}</td>
                  `).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 5px;">Kết luận:</div>
          <div>${testOrderPreview.conclusion || "-"}</div>
        </div>
      `;
      
      document.body.appendChild(pdfContent);
      
      // Chuyển đổi HTML thành canvas
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Tạo PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Tải xuống PDF
      pdf.save(`bao-cao-adn-${testOrderPreview.id}.pdf`);
      
      // Xóa div tạm
      document.body.removeChild(pdfContent);
      
      alert('PDF đã được xuất thành công!');
      handleExportModalClose();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Có lỗi xảy ra khi xuất PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCheckTestOrder = async () => {
    if (!exportTestOrderId) {
      alert("Vui lòng nhập ID đơn hẹn!");
      return;
    }
    setIsChecking(true);
    setTestOrderPreview(null);
    try {
      const data = await getTestOrderById(Number(exportTestOrderId));
      setTestOrderPreview(data.result);
    } catch (err: any) {
      setTestOrderPreview({ error: err.message || "Không tìm thấy dữ liệu!" });
    } finally {
      setIsChecking(false);
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
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={handleExportPDF}
            >
              Xuất file PDF
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={handleCreateClick}
            >
              Tạo kết quả xét nghiệm
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
                Mã kết quả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn hẹn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày kết quả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kết luận
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên dịch vụ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phương pháp lấy mẫu
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
            {results.map((result: any) => (
              <tr key={result.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {result.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{result.testOrderId}</div>
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
                  <div className="text-sm text-gray-900">
                    {result.serviceName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {result.sampleMethodName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {result.filePath && result.filePath.startsWith("http") ? (
                      <div className="flex space-x-2">
                        <a
                          href={result.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          📄 Xem file
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-500">{result.filePath || "Không có file"}</span>
                    )}
                  </div>
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
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (file) {
                      // Kiểm tra loại file
                      if (file.type !== "application/pdf") {
                        alert("Chỉ chấp nhận file PDF! Vui lòng chọn file PDF.");
                        e.target.value = "";
                        setSelectedUpdateFile(null);
                        return;
                      }
                      
                      // Kiểm tra kích thước file (max 10MB)
                      const maxSize = 10 * 1024 * 1024; // 10MB
                      if (file.size > maxSize) {
                        alert("File quá lớn! Kích thước tối đa là 10MB.");
                        e.target.value = "";
                        setSelectedUpdateFile(null);
                        return;
                      }
                    }
                    setSelectedUpdateFile(file);
                  }}
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
                  htmlFor="testOrderId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mã đơn hẹn
                </label>
                <input
                  type="number"
                  id="testOrderId"
                  name="testOrderId"
                  value={createFormData.testOrderId}
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
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (file) {
                      // Kiểm tra loại file
                      if (file.type !== "application/pdf") {
                        alert("Chỉ chấp nhận file PDF! Vui lòng chọn file PDF.");
                        e.target.value = "";
                        setSelectedCreateFile(null);
                        return;
                      }
                      
                      // Kiểm tra kích thước file (max 10MB)
                      const maxSize = 10 * 1024 * 1024; // 10MB
                      if (file.size > maxSize) {
                        alert("File quá lớn! Kích thước tối đa là 10MB.");
                        e.target.value = "";
                        setSelectedCreateFile(null);
                        return;
                      }
                    }
                    setSelectedCreateFile(file);
                  }}
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

      {/* Modal nhập ID đơn hẹn để xuất PDF */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-2/3 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Nhập ID đơn hẹn để xuất PDF</h3>
            <div className="flex space-x-2 mb-4">
              <input
                type="number"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                placeholder="Nhập ID đơn hẹn"
                value={exportTestOrderId}
                onChange={e => setExportTestOrderId(e.target.value)}
                disabled={isExporting || isChecking}
              />
              <button
                type="button"
                onClick={handleCheckTestOrder}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={isExporting || isChecking || !exportTestOrderId}
              >
                {isChecking ? "Đang kiểm tra..." : "Kiểm tra"}
              </button>
            </div>
            {testOrderPreview && (
              <div className="mb-4 p-3 bg-gray-50 border rounded text-sm">
                {testOrderPreview.error ? (
                  <span className="text-red-600">{testOrderPreview.error}</span>
                ) : (
                  <AdnReportPreview data={testOrderPreview} />
                )}
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleExportModalClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                disabled={isExporting}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleExportConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={isExporting || !exportTestOrderId}
              >
                {isExporting ? "Đang lấy dữ liệu..." : "Lấy dữ liệu & Xuất PDF"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultManagement;
