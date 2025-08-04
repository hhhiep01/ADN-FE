// User Account Interfaces
export interface Role {
  id: number;
  name: string;
}

export interface UserAccount {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: Role;
}

// API Response Interfaces
export interface GetAllAccountsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: UserAccount[];
}

export interface GetAllStaffAccountsResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: UserAccount[];
} 