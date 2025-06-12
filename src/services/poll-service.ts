import { AppError } from '@/utils/app-error';
import { PollRepository } from '../repositories/poll-repository';
import {
  Poll,
  PollStats,
  CreatePollInput,
  GetPollsInput,
} from '../types/poll-types';

export class PollService {
  private pollRepository: PollRepository;

  constructor() {
    this.pollRepository = new PollRepository();
  }

  async createPoll(input: CreatePollInput): Promise<void> {
    const poll: Omit<Poll, 'id' | 'createdAt'> = {
      title: input.title,
      options: input.options,
      // tags: input.tags || [],
    };
    await this.pollRepository.create(poll);
  }

  async getPolls(input: GetPollsInput): Promise<Poll[]> {
    const page = input.page || 1;
    const limit = input.limit || 10;
    const skip = (page - 1) * limit;

    return this.pollRepository.find({
      tag: input.tag,
      userId: input.userId,
      skip,
      limit,
    });
  }

  async votePoll(
    pollId: string,
    userId: string,
    optionIndex: number
  ): Promise<void> {
    // TODO: Optimze for high concurency
    const dailyVoteCount =
      await this.pollRepository.getUserDailyVoteCount(userId);
    console.log('dailyVoteCount', dailyVoteCount);
    if (dailyVoteCount >= 100) {
      throw AppError.badRequest({
        message: 'Daily vote limit of 100 reached',
      });
    }

    const poll = await this.pollRepository.findById(pollId);
    if (!poll) {
      throw AppError.notFound({
        message: 'Poll not found',
      });
    }

    if (optionIndex >= poll.options.length) {
      throw AppError.badRequest({
        message: 'Invalid option index',
      });
    }

    await this.pollRepository.recordVote(pollId, userId, optionIndex);
  }

  async skipPoll(pollId: string, userId: string): Promise<void> {
    const poll = await this.pollRepository.findById(pollId);
    if (!poll) {
      throw AppError.notFound({
        message: 'Poll not found',
      });
    }

    await this.pollRepository.recordSkip(pollId, userId);
  }

  async getPollStats(pollId: string): Promise<PollStats> {
    const poll = await this.pollRepository.findById(pollId);
    if (!poll) {
      throw AppError.notFound({
        message: 'Poll not found',
      });
    }

    const voteCounts = await this.pollRepository.getVoteCounts(pollId);
    const stats: PollStats = {
      pollId,
      votes: poll.options.map((option, index) => ({
        option,
        count: voteCounts[index] || 0,
      })),
    };

    return stats;
  }
}
