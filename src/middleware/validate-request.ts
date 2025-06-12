import { AppError } from '@/utils/app-error';
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError, ZodIssue } from 'zod';

declare global {
  namespace Express {
    interface Request {
      validated?: {
        body?: any;
        params?: any;
        query?: any;
        headers?: any;
      };
    }
  }
}

interface ValidationOptions {
  stripUnknown?: boolean;
  errorMessage?: string;
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
  received?: any;
}

export const validateRequest = (
  schema: AnyZodObject,
  options: ValidationOptions = {}
) => {
  const { stripUnknown = true } = options;

  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Prepare data for validation
      const dataToValidate = {
        ...(req.body !== undefined && { body: req.body }),
        ...(Object.keys(req.params).length > 0 && { params: req.params }),
        ...(Object.keys(req.query).length > 0 && { query: req.query }),
        ...(req.headers && { headers: req.headers }),
      };

      // Validate request data
      const validatedData = await schema.parseAsync(dataToValidate);

      // Store validated data in a separate property to avoid overwriting original data
      req.validated = validatedData;

      // Optionally update original request properties with validated data
      if (stripUnknown) {
        if (validatedData.body !== undefined) req.body = validatedData.body;
        if (validatedData.params !== undefined)
          req.params = validatedData.params;
        if (validatedData.query !== undefined) req.query = validatedData.query;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: ValidationError[] = error.errors.map(
          (issue: ZodIssue) => ({
            field: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })
        );

        throw AppError.badRequest(validationErrors);
      }

      // Log unexpected errors for debugging
      console.error('Validation middleware error:', error);

      throw AppError.internal();
    }
  };
};
