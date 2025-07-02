import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  getUserHistoryResult,
  type GetUserHistoryResultResponse,
  type UserHistoryResultItem,
} from "../Services/ResultService/UserHistoryResult";
import { 
  FaFilePdf, 
  FaCalendarAlt, 
  FaFlask, 
  FaClipboardCheck, 
  FaDownload,
  FaEye,
  FaSearch,
  FaFilter
} from "react-icons/fa";

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data, isLoading, isError, error } =
    useQuery<GetUserHistoryResultResponse>({
      queryKey: ["user-history-results"],
      queryFn: ({ signal }) => getUserHistoryResult(signal),
    });

  const results = data?.result || [];

  // Filter results based on search term
  const filteredResults = results.filter((result) =>
    result.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.sampleId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải kết quả xét nghiệm...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">Lỗi khi tải dữ liệu</h3>
          <p className="text-gray-600">{error?.message || "Đã xảy ra lỗi khi tải dữ liệu."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Kết Quả Xét Nghiệm
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Xem và tải xuống kết quả xét nghiệm ADN của bạn
          </p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã kết quả, mã mẫu hoặc tên dịch vụ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {[
                { id: 'all', name: 'Tất cả', color: 'bg-blue-500' },
                { id: 'completed', name: 'Hoàn thành', color: 'bg-green-500' },
                { id: 'pending', name: 'Đang xử lý', color: 'bg-yellow-500' }
              ].map((status) => (
                <button
                  key={status.id}
                  onClick={() => setSelectedStatus(status.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedStatus === status.id
                      ? `${status.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            Tìm thấy {filteredResults.length} kết quả
            {searchTerm && ` cho "${searchTerm}"`}
          </div>
        </motion.div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnimatePresence mode="wait">
            {filteredResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Kết quả #{result.id}</h3>
                      <p className="text-blue-100 text-sm">Mã mẫu: {result.sampleId}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Hoàn thành
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Service Info */}
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <FaFlask className="text-blue-500 mr-2" />
                      <h4 className="font-semibold text-gray-900">{result.serviceName}</h4>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaClipboardCheck className="mr-2" />
                      <span>{result.sampleMethodName}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <FaCalendarAlt className="mr-2" />
                    <span>Ngày kết quả: {new Date(result.resultDate).toLocaleDateString('vi-VN')}</span>
                  </div>

                  {/* Conclusion */}
                  {result.conclusion && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <h5 className="font-semibold text-gray-900 mb-2">Kết luận:</h5>
                      <p className="text-gray-700 text-sm leading-relaxed">{result.conclusion}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    {result.filePath && (
                      <>
                        <a
                          href={result.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FaEye />
                          Xem kết quả
                        </a>
                        <a
                          href={result.filePath}
                          download
                          className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FaDownload />
                          Tải PDF
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredResults.length === 0 && !isLoading && !isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Không tìm thấy kết quả nào
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? `Không có kết quả nào phù hợp với "${searchTerm}". Thử tìm kiếm với từ khóa khác.`
                : "Bạn chưa có kết quả xét nghiệm nào. Hãy đặt lịch xét nghiệm để nhận kết quả."
              }
            </p>
          </motion.div>
        )}

        {/* Summary Stats */}
        {filteredResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Thống kê</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{filteredResults.length}</div>
                <div className="text-gray-600">Tổng số kết quả</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {filteredResults.filter(r => r.conclusion).length}
                </div>
                <div className="text-gray-600">Có kết luận</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {filteredResults.filter(r => r.filePath).length}
                </div>
                <div className="text-gray-600">Có file PDF</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Results;
