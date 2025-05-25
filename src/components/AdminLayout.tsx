import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { UserRole } from '../types/auth';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') as UserRole | null;

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  if (!userRole || (userRole !== 'admin' && userRole !== 'staff')) {
    navigate('/login');
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
            {userRole === 'admin' && (
              <Link
                to="/admin/users"
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Quản lý người dùng
              </Link>
            )}
            <Link
              to="/staff/appointments"
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Quản lý đơn hẹn
            </Link>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
            <h1 className="text-2xl font-semibold text-gray-900">
              {userRole === 'admin' ? 'Quản trị hệ thống' : 'Quản lý đơn hẹn'}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 