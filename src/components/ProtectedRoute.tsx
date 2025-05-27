import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

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

  if (!isAuthenticated || !user) {
    // Redirect to appropriate login page based on the first allowed role
    const loginPath = allowedRoles[0] === 'customer' ? '/customer/login' : '/admin/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  const userRole = user.role.toLowerCase();
  const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);

  if (!hasPermission) {
    // Redirect to appropriate login page based on user's role
    const loginPath = userRole === 'customer' ? '/customer/login' : '/admin/login';
    return <Navigate to={loginPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 