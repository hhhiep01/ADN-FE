// Payment Interfaces
export interface PaymentHistory {
  id: number;
  statusPayment: number;
  amount: number;
  testOrderId: number;
  createdDate: string;
  modifiedDate: string | null;
  customerName: string;
  serviceName: string;
  servicePrice: number;
  sampleMethodName: string;
  testOrderStatus: number;
}

// API Response Interfaces
export interface GetAllPaymentHistoryResponse {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: PaymentHistory[];
}

// Payment Status Enum
export enum PaymentStatus {
  NOT_COMPLETED = 0,
  SUCCESS = 1,
  FAILED = 2,
  PENDING = 3,
  PAID = 4
}

// Test Order Status Enum
export enum TestOrderStatus {
  PENDING = 0,
  CONFIRMED = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  CANCELLED = 4
}

// Helper functions
export const getPaymentStatusText = (status: number): string => {
  switch (status) {
    case PaymentStatus.NOT_COMPLETED:
      return 'Chưa hoàn thành';
    case PaymentStatus.SUCCESS:
      return 'Thành công';
    case PaymentStatus.FAILED:
      return 'Thất bại';
    case PaymentStatus.PENDING:
      return 'Chờ thanh toán';
    case PaymentStatus.PAID:
      return 'Đã thanh toán';
    default:
      return 'Không xác định';
  }
};

export const getPaymentStatusColor = (status: number): string => {
  switch (status) {
    case PaymentStatus.NOT_COMPLETED:
      return 'bg-gray-100 text-gray-800';
    case PaymentStatus.SUCCESS:
      return 'bg-green-100 text-green-800';
    case PaymentStatus.FAILED:
      return 'bg-red-100 text-red-800';
    case PaymentStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case PaymentStatus.PAID:
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getTestOrderStatusText = (status: number): string => {
  switch (status) {
    case TestOrderStatus.PENDING:
      return 'Chờ xác nhận';
    case TestOrderStatus.CONFIRMED:
      return 'Đã xác nhận';
    case TestOrderStatus.IN_PROGRESS:
      return 'Đang xử lý';
    case TestOrderStatus.COMPLETED:
      return 'Hoàn thành';
    case TestOrderStatus.CANCELLED:
      return 'Đã hủy';
    default:
      return 'Không xác định';
  }
}; 