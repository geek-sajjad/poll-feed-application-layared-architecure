import { Request, Response } from 'express';
import { PollService } from '../services/poll-service';
import { getValidatedData } from '@/utils/helper-functions';
import {
  createPollSchema,
  getPollsSchema,
  skipPollSchema,
  votePollSchema,
} from '@/constants/validation-schemas';

export class PollController {
  private pollService: PollService;

  constructor() {
    this.pollService = new PollService();
  }

  async createPoll(req: Request, res: Response): Promise<void> {
    const { body } = getValidatedData(req, createPollSchema);
    await this.pollService.createPoll({
      options: body.options,
      title: body.title,
    });
    res.status(201).send();
  }

  async getPolls(req: Request, res: Response): Promise<void> {
    const { query } = getValidatedData(req, getPollsSchema);
    const { tag, page, limit, userId } = query;

    const polls = await this.pollService.getPolls({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      tag,
      userId,
    });
    res.status(200).json(polls);
  }

  async votePoll(req: Request, res: Response): Promise<void> {
    const { body, params } = getValidatedData(req, votePollSchema);
    await this.pollService.votePoll(params.id, body.userId, body.optionIndex);
    res.status(200).send();
  }

  async skipPoll(req: Request, res: Response): Promise<void> {
    const { body, params } = getValidatedData(req, skipPollSchema);
    await this.pollService.skipPoll(params.id, body.userId);
    res.status(200).send();
  }

  async getPollStats(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const stats = await this.pollService.getPollStats(id);
    res.status(200).json(stats);
  }
}
