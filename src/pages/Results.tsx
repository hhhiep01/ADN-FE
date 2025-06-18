import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAllResults,
  type GetAllResultsResponse,
  type ResultItem,
} from "../Services/ResultService/GetAllResults";

interface TestResult {
  id: string;
  testType: string;
  date: string;
  status: "pending" | "completed" | "processing";
  result?: string;
  filePath?: string;
}

const Results = () => {
  const [searchId, setSearchId] = useState("");

  const { data, isLoading, isError, error } = useQuery<GetAllResultsResponse>({
    queryKey: ["results", searchId],
    queryFn: ({ signal }) =>
      getAllResults({ signal, resultId: searchId || undefined }),
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

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo Mã kết quả..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="px-4 py-2 border rounded-md w-full max-w-sm"
        />
      </div>

      <div className="space-y-4">
        {results.map((r) => (
          <div key={r.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">Mã kết quả: {r.id}</h2>
                <p>Mã mẫu: {r.sampleId}</p>
                <p>
                  Ngày kết quả: {new Date(r.resultDate).toLocaleDateString()}
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
