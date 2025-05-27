import { jwtDecode } from 'jwt-decode';

// JWT Payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  fullName: string;
  exp: number;
  [key: string]: any;
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const decoded = jwtDecode<any>(token);
    
    return {
      userId: decoded.UserId || decoded.userId,
      email: decoded.Email || decoded.email,
      role: decoded.Role || decoded.role,
      fullName: decoded.FullName || decoded.fullName || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      exp: decoded.exp,
      ...decoded
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  // exp is in seconds, Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
};

export const getUserFromToken = (): JWTPayload | null => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  
  if (isTokenExpired(token)) {
    // Remove expired token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    return null;
  }
  
  return decodeJWT(token);
}; 