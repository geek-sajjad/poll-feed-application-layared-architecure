import { Request, Response } from 'express';
import { PollService } from '../services/poll-service';
import { getValidatedData } from '@/utils/helper-functions';
import { createPollSchema } from '@/constants/validation-schemas';

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
    const { tag, page, limit, userId } = req.query;
    const polls = await this.pollService.getPolls({
      tag: tag as string | undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      userId: userId as string,
    });
    res.status(200).json(polls);
  }

  async votePoll(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { userId, optionIndex } = req.body;
    await this.pollService.votePoll(id, userId, optionIndex);
    res.status(200).send();
  }

  async skipPoll(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { userId } = req.body;
    await this.pollService.skipPoll(id, userId);
    res.status(200).send();
  }

  async getPollStats(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const stats = await this.pollService.getPollStats(id);
    res.status(200).json(stats);
  }
}
