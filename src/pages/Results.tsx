import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getUserHistoryResult,
  type GetUserHistoryResultResponse,
  type UserHistoryResultItem,
} from "../Services/ResultService/UserHistoryResult";

const Results = () => {
  // Không cần searchId vì API user-history không nhận tham số
  const { data, isLoading, isError, error } =
    useQuery<GetUserHistoryResultResponse>({
      queryKey: ["user-history-results"],
      queryFn: ({ signal }) => getUserHistoryResult(signal),
    });

  const results = data?.result || [];

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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Kết quả xét nghiệm</h1>

      <div className="space-y-4">
        {results.map((r: UserHistoryResultItem) => (
          <div key={r.id} className="bg-white p-4 rounded shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div>
                <h2 className="text-xl font-semibold">Mã kết quả: {r.id}</h2>
                <p>
                  <span className="font-medium">Mã mẫu:</span> {r.sampleId}
                </p>
                <p>
                  <span className="font-medium">Ngày kết quả:</span>{" "}
                  {new Date(r.resultDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Tên dịch vụ:</span>{" "}
                  {r.serviceName}
                </p>
                <p>
                  <span className="font-medium">Phương pháp lấy mẫu:</span>{" "}
                  {r.sampleMethodName}
                </p>
              </div>
            </div>

            {r.conclusion && (
              <div className="mt-2">
                <p className="font-medium">Kết luận:</p>
                <p>{r.conclusion}</p>
              </div>
            )}

            {r.filePath && (
              <div className="mt-2">
                <a
                  href={r.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  📥 Xem/Tải file PDF
                </a>
              </div>
            )}
          </div>
        ))}
        {results.length === 0 && !isLoading && !isError && (
          <div className="text-center py-12 text-gray-600">
            Không tìm thấy kết quả nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
