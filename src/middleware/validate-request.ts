import { AppError } from '@/utils/app-error';
import { transformQueryArrays } from '@/utils/helper-functions';
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
      const transformedQuery = transformQueryArrays(req.query);

      // Prepare data for validation
      const dataToValidate = {
        ...(req.body !== undefined && { body: req.body }),
        ...(Object.keys(req.params).length > 0 && { params: req.params }),
        ...(Object.keys(transformedQuery).length > 0 && {
          query: transformedQuery,
        }),
        ...(req.headers && { headers: req.headers }),
      };

      // Validate request data
      const validatedData = await schema.parseAsync(dataToValidate);

      // Store validated data in a separate property to avoid overwriting original data
      req.validated = validatedData;

      // Optionally update original request properties with validated data
      // TODO:fix the bug of not assigning the req properties
      // if (stripUnknown) {
      //   console.log('req.params', req.params);
      //   if (validatedData.body !== undefined)
      //     Object.assign(req.body, validatedData.body);
      //   if (validatedData.params !== undefined)
      //     Object.assign(req.params, validatedData.params);
      //   if (validatedData.query !== undefined)
      //     Object.assign(req.query, { test: 'sad' });
      // }
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
