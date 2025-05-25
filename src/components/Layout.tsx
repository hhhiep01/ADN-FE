import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { UserRole } from '../types/auth';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') as UserRole | null;

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">ADN Testing</span>
              </Link>
              
              {/* Public Navigation */}
              <Link to="/services" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">
                Dịch vụ
              </Link>
              <Link to="/blog" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">
                Blog
              </Link>
              <Link to="/appointment" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">
                Đặt lịch
              </Link>

              {/* Customer & Guest Navigation */}
              {(userRole === 'customer' || userRole === 'guest') && (
                <>
                  <Link to="/results" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">
                    Kết quả xét nghiệm
                  </Link>
                  <Link to="/profile" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">
                    Tài khoản
                  </Link>
                </>
              )}

              {/* Admin Navigation */}
              {userRole === 'admin' && (
                <>
                  <Link to="/admin/users" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">
                    Quản lý người dùng
                  </Link>
                  <Link to="/staff/appointments" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">
                    Quản lý đơn hẹn
                  </Link>
                </>
              )}

              {/* Staff Navigation */}
              {userRole === 'staff' && (
                <Link to="/staff/appointments" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500">
                  Quản lý đơn hẹn
                </Link>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {userRole ? (
                <button
                  onClick={handleLogout}
                  className="text-gray-900 hover:text-blue-600"
                >
                  Đăng xuất
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-900 hover:text-blue-600"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 