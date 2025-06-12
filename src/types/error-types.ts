export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path: string;
  };
}

export interface ApiError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
}
