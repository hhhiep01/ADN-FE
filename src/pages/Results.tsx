import { useState } from 'react';

interface TestResult {
  id: string;
  testType: string;
  date: string;
  status: 'pending' | 'completed' | 'processing';
  result?: string;
}

const Results = () => {
  const [searchId, setSearchId] = useState('');
  const [results, setResults] = useState<TestResult[]>([
    {
      id: 'ADN-2024-001',
      testType: 'Xét nghiệm ADN Cha - Con',
      date: '2024-02-20',
      status: 'completed',
      result: '99.99% khả năng có quan hệ huyết thống'
    },
    {
      id: 'ADN-2024-002',
      testType: 'Xét nghiệm ADN Mẹ - Con',
      date: '2024-02-21',
      status: 'processing'
    }
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchId);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Kết quả xét nghiệm</h1>

      <form onSubmit={handleSearch} className="flex gap-4">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Nhập mã xét nghiệm"
          className="flex-1 border border-gray-300 rounded-md px-4 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Tìm kiếm
        </button>
      </form>

      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{result.testType}</h2>
                <p className="text-gray-600">Mã xét nghiệm: {result.id}</p>
                <p className="text-gray-600">Ngày thực hiện: {result.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                result.status === 'completed' ? 'bg-green-100 text-green-800' :
                result.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {result.status === 'completed' ? 'Hoàn thành' :
                 result.status === 'processing' ? 'Đang xử lý' :
                 'Chờ xử lý'}
              </span>
            </div>
            {result.result && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="font-medium">Kết quả:</p>
                <p className="text-gray-700">{result.result}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results; 