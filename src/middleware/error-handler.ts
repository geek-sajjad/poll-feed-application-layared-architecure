import { ERROR_CODES } from '@/constants/error-codes';
import { ErrorResponse } from '@/types/error-types';
import { AppError } from '@/utils/app-error';
import { Request, Response, NextFunction } from 'express';

// // Handle specific error types
// const handleCastErrorDB = (err: any): AppError => {
//   const message = `Invalid ${err.path}: ${err.value}`;
//   return AppError.badRequest(ERROR_CODES.INVALID_INPUT, {
//     field: err.path,
//     value: err.value,
//   });
// };

// const handleDuplicateFieldsDB = (err: any): AppError => {
//   const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
//   const message = `Duplicate field value: ${value}. Please use another value!`;
//   return AppError.conflict(ERROR_CODES.RESOURCE_ALREADY_EXISTS, {
//     duplicateValue: value,
//   });
// };

// const handleValidationErrorDB = (err: any): AppError => {
//   const errors = Object.values(err.errors).map((el: any) => el.message);
//   const message = `Invalid input data. ${errors.join('. ')}`;
//   return AppError.badRequest(ERROR_CODES.VALIDATION_ERROR, {
//     validationErrors: errors,
//   });
// };

// const handleJWTError = (): AppError =>
//   AppError.unauthorized(ERROR_CODES.TOKEN_INVALID);

// const handleJWTExpiredError = (): AppError =>
//   AppError.unauthorized(ERROR_CODES.TOKEN_EXPIRED);

// Global error handling middleware
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(err);
  // Set default values
  let error = { ...err };
  error.statusCode = err.statusCode || 500;
  error.code = err.code || ERROR_CODES.INTERNAL_SERVER_ERROR;
  error.isOperational = err.isOperational || false;

  // Handle specific error types
  // if (err.name === 'CastError') error = handleCastErrorDB(error);
  // if (err.code === 11000) error = handleDuplicateFieldsDB(error);
  // if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
  // if (err.name === 'JsonWebTokenError') error = handleJWTError();
  // if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Log error for monitoring

  console.error('ERROR 💥', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};
// Development error response (includes stack trace)
const sendErrorDev = (err: AppError, req: Request, res: Response): void => {
  const errorResponse: ErrorResponse & { stack?: string } = {
    success: false,
    error: {
      code: err.code || ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message,
      details: err.details,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    },
    stack: err.stack,
  };

  res.status(err.statusCode || 500).json(errorResponse);
};

// Production error response (no stack trace)
const sendErrorProd = (err: AppError, req: Request, res: Response): void => {
  // Only send error details if it's an operational error
  if (err.isOperational) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: err.code || ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: err.message,
        details: err.details,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    };

    res.status(err.statusCode || 500).json(errorResponse);
  } else {
    // Programming or unknown error: don't leak error details
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong!',
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    };

    res.status(500).json(errorResponse);
  }
};

// 404 handler middleware
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = AppError.notFound({
    resource: req.originalUrl,
    method: req.method,
  });
  next(error);
};

// Async error wrapper
// export const catchAsync = (fn: Function) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
// };

// Process unhandled promise rejections and uncaught exceptions
// export const setupProcessErrorHandlers = (): void => {
//   process.on('uncaughtException', (err: Error) => {
//     console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//     console.error(err.name, err.message);
//     process.exit(1);
//   });

//   process.on('unhandledRejection', (err: Error) => {
//     console.error('UNHANDLED REJECTION! 💥 Shutting down...');
//     console.error(err.name, err.message);
//     // Give the server time to finish all pending requests
//     setTimeout(() => {
//       process.exit(1);
//     }, 1000);
//   });
// };
