import { useState, useEffect } from 'react';
import { getUserFromToken, type JWTPayload } from '../utils/jwtUtils';

export const useAuth = () => {
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userInfo = getUserFromToken();
      
      if (userInfo) {
        setUser(userInfo);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = user?.role === 'Admin' || user?.role === 'admin';
  const isStaff = user?.role === 'Staff' || user?.role === 'staff';
  const isCustomer = user?.role === 'Customer' || user?.role === 'customer';

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    isAdmin,
    isStaff,
    isCustomer
  };
}; 