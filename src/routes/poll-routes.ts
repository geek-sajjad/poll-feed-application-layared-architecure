import { Router } from 'express';
import { PollController } from '../controllers/poll-controller';
import { validateRequest } from '../middleware/validate-request';
import {
  createPollSchema,
  getPollsSchema,
  getPollStatsSchema,
  skipPollSchema,
  votePollSchema,
} from '@/constants/validation-schemas';

const router = Router();
const pollController = new PollController();
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
