import { ERROR_CODES } from './error-codes';

export const ERROR_MESSAGES = {
  [ERROR_CODES.UNAUTHORIZED]: 'Authentication required to access this resource',
  [ERROR_CODES.FORBIDDEN]: 'You do not have permission to access this resource',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid username or password',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please log in again',
  [ERROR_CODES.TOKEN_INVALID]: 'Invalid authentication token',

  [ERROR_CODES.VALIDATION_ERROR]: 'The provided data is invalid',
  [ERROR_CODES.INVALID_INPUT]: 'One or more input fields are invalid',
  [ERROR_CODES.REQUIRED_FIELD_MISSING]: 'Required field is missing',
  [ERROR_CODES.INVALID_FORMAT]: 'Data format is invalid',

  [ERROR_CODES.RESOURCE_NOT_FOUND]: 'The requested resource was not found',
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',
  [ERROR_CODES.RESOURCE_CONFLICT]: 'Resource conflict detected',

  [ERROR_CODES.INTERNAL_SERVER_ERROR]:
    'An unexpected error occurred. Please try again later',
  [ERROR_CODES.DATABASE_ERROR]: 'Database operation failed',
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]:
    'External service is currently unavailable',

  [ERROR_CODES.TOO_MANY_REQUESTS]: 'Too many requests. Please try again later',
  [ERROR_CODES.REQUEST_TIMEOUT]: 'Request timeout. Please try again',
  [ERROR_CODES.PAYLOAD_TOO_LARGE]: 'Request payload is too large',

  [ERROR_CODES.INSUFFICIENT_PERMISSIONS]:
    'Insufficient permissions for this operation',
  [ERROR_CODES.OPERATION_NOT_ALLOWED]: 'This operation is not allowed',
  [ERROR_CODES.QUOTA_EXCEEDED]: 'Usage quota exceeded',
} as const;
