import { ERROR_CODES } from '../constants/error-codes';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { ApiError } from '../types/error-types';

export class AppError extends Error implements ApiError {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    code: keyof typeof ERROR_CODES,
    statusCode: number = 500,
    details?: any,
    isOperational: boolean = true
  ) {
    const message = ERROR_MESSAGES[code] || 'An unexpected error occurred';
    super(message);

    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  // Static factory methods for common errors
  static badRequest(
    // code: keyof typeof ERROR_CODES = ERROR_CODES.INVALID_INPUT,
    details?: any
  ) {
    return new AppError(ERROR_CODES.INVALID_INPUT, 400, details);
  }

  static unauthorized(
    // code: keyof typeof ERROR_CODES = ERROR_CODES.UNAUTHORIZED,
    details?: any
  ) {
    return new AppError(ERROR_CODES.UNAUTHORIZED, 401, details);
  }

  static forbidden(
    // code: keyof typeof ERROR_CODES = ERROR_CODES.FORBIDDEN,
    details?: any
  ) {
    return new AppError(ERROR_CODES.FORBIDDEN, 403, details);
  }

  static notFound(
    // code: keyof typeof ERROR_CODES = ERROR_CODES.RESOURCE_NOT_FOUND,
    details?: any
  ) {
    return new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 404, details);
  }

  static conflict(
    // code: keyof typeof ERROR_CODES = ERROR_CODES.RESOURCE_CONFLICT,
    details?: any
  ) {
    return new AppError(ERROR_CODES.RESOURCE_CONFLICT, 409, details);
  }

  static tooManyRequests(
    // code: keyof typeof ERROR_CODES = ERROR_CODES.TOO_MANY_REQUESTS,
    details?: any
  ) {
    return new AppError(ERROR_CODES.TOO_MANY_REQUESTS, 429, details);
  }

  static internal(
    // code: keyof typeof ERROR_CODES = ERROR_CODES.INTERNAL_SERVER_ERROR,
    details?: any
  ) {
    return new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR, 500, details);
  }
}
