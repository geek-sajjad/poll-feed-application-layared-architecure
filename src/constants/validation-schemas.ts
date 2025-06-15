import { z } from 'zod';

export const createPollSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    options: z
      .array(z.string().min(1, 'Option cannot be empty'))
      .min(1, 'At least one option is required'),
    tags: z
      .array(z.string().min(1, 'Tag cannot be empty'))
      .optional()
      .refine(tags => tags === undefined || tags.length > 0, {
        message: 'At least one tag is required if tags are provided',
      }),
  }),
});

export const getPollsSchema = z.object({
  query: z.object({
    tag: z.array(z.string().optional()),
    page: z
      .string()
      .regex(/^\d+$/, 'Page must be a positive integer')
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a positive integer')
      .optional(),
    userId: z
      .string()
      .uuid('Invalid user ID format')
      .or(z.string().min(1, 'User ID is required')),
  }),
});

export const votePollSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid('Invalid poll ID format')
      .or(z.string().min(1, 'Poll ID is required')),
  }),
  body: z.object({
    userId: z
      .string()
      .uuid('Invalid user ID format')
      .or(z.string().min(1, 'User ID is required')),
    optionIndex: z
      .number()
      .int()
      .min(0, 'Option index must be a non-negative integer'),
  }),
});

export const skipPollSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid('Invalid poll ID format')
      .or(z.string().min(1, 'Poll ID is required')),
  }),
  body: z.object({
    userId: z
      .string()
      .uuid('Invalid user ID format')
      .or(z.string().min(1, 'User ID is required')),
  }),
});

export const getPollStatsSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid('Invalid poll ID format')
      .or(z.string().min(1, 'Poll ID is required')),
  }),
});
