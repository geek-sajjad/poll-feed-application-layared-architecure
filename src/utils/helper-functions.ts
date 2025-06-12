import { z } from 'zod';
import { Request } from 'express';

export function getValidatedData<T extends z.ZodType>(
  req: Request,
  schema: T
): z.infer<T>;

export function getValidatedData<T extends z.ZodType>(req: Request): z.infer<T>;
export function getValidatedData<T extends z.ZodType>(
  req: Request,
  schema?: T
) {
  return req.validated as z.infer<T>;
}


export const transformQueryArrays = (query: any): any => {
  const transformed = { ...query };

  for (const [key, value] of Object.entries(transformed)) {
    if (typeof value === 'string' && value.includes(',')) {
      // Split by comma and trim whitespace
      transformed[key] = value.split(',').map((item: string) => item.trim());
    }
  }

  return transformed;
}
