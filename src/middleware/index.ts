import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { AnyZodObject, ZodError } from 'zod';

// Rate limiting middleware
export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// JWT Authentication middleware
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access token is missing',
    });
    return;
  }

  jwt.verify(token, config.auth.jwtSecret, (err: any, user: any) => {
    if (err) {
      res.status(403).json({
        success: false,
        message: 'Token is invalid or expired',
      });
      return;
    }

    req.user = user;
    next();
  });
};

// Error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // TypeORM duplicate key error
  if (err.message.includes('duplicate key')) {
    const message = 'Resource already exists';
    error = { name: 'ValidationError', message } as any;
  }

  // TypeORM validation error
  if (err.name === 'QueryFailedError') {
    const message = 'Database query failed';
    error = { name: 'ValidationError', message } as any;
  }

  res.status(error.name === 'ValidationError' ? 400 : 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

// Request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

export const validateRequest = (schema: AnyZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate request data (body, params, query)
      const validatedData = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // Attach validated data to request object
      req.body = validatedData.body || req.body;
      req.params = validatedData.params || req.params;
      req.query = validatedData.query || req.query;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        res.status(400).json({
          error: 'Validation failed',
          details: errorMessages,
        });
        return;
      }

      // Handle other errors
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  };
};
