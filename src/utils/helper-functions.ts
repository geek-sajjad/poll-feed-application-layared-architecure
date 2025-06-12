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
