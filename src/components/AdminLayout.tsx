import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin, isStaff, isLoading } =
    useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated or not admin/staff
  if (!isAuthenticated || !user || (!isAdmin && !isStaff)) {
    navigate("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b">
            <span className="text-xl font-bold text-blue-600">ADN Testing</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {isAdmin ? (
              <>
                <Link
                  to="/admin/users"
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Quản lý người dùng
                </Link>
                <Link
                  to="/admin/transaction-history"
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  Lịch sử giao dịch
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/staff/appointments"
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                    />
                  </svg>
                  Quản lý đơn hẹn
                </Link>
                <Link
                  to="/staff/samples"
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Quản lý mẫu xét nghiệm
                </Link>
                <Link
                  to="/staff/sample-types"
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Quản lý phân loại mẫu xét nghiệm
                </Link>
                <Link
                  to="/staff/services"
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  Quản lý dịch vụ
                </Link>
                <Link
                  to="/staff/results"
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 17v-2m3 2v-4m3 2v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Quản lý kết quả xét nghiệm
                </Link>
                <Link
                  to="/staff/blog-management"
                  className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 4v16h14V4H5zm2 2h10v12H7V6zm2 2v8h6V8H9z"
                    />
                  </svg>
                  Quản lý Blog
                </Link>
              </>
            )}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t">
            <div className="text-sm text-gray-600 mb-2">
              <div className="font-medium">{user.fullName}</div>
              <div className="text-xs">{user.email}</div>
              <div className="text-xs text-blue-600">{user.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-4">
            {/* Đã xóa tiêu đề lớn ở đây */}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
