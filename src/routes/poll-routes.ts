import { Router } from 'express';
import { z } from 'zod';
import { PollController } from '../controllers/poll-controller';
import { validateRequest } from '../middleware';

const router = Router();
const pollController = new PollController();

// Zod schemas
const createPollSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    options: z
      .array(z.string().min(1, 'Option cannot be empty'))
      .min(1, 'At least one option is required'),
    tags: z.array(z.string().min(1, 'Tag cannot be empty')).optional(),
  }),
});

const getPollsSchema = z.object({
  query: z.object({
    tag: z.string().min(1, 'Tag cannot be empty').optional(),
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

const votePollSchema = z.object({
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

const skipPollSchema = z.object({
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

const getPollStatsSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid('Invalid poll ID format')
      .or(z.string().min(1, 'Poll ID is required')),
  }),
});

// Routes
router.post(
  '/',
  validateRequest(createPollSchema),
  pollController.createPoll.bind(pollController)
);

router.get(
  '/',
  validateRequest(getPollsSchema),
  pollController.getPolls.bind(pollController)
);

router.post(
  '/:id/vote',
  validateRequest(votePollSchema),
  pollController.votePoll.bind(pollController)
);

router.post(
  '/:id/skip',
  validateRequest(skipPollSchema),
  pollController.skipPoll.bind(pollController)
);

router.get(
  '/:id/stats',
  validateRequest(getPollStatsSchema),
  pollController.getPollStats.bind(pollController)
);

export { router as pollRoutes };
