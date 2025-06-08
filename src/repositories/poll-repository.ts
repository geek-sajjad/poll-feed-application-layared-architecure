import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { PollEntity } from '../entities/poll-entity';
import { VoteEntity } from '../entities/vote-entity';
import { Poll } from '../types/poll-types';

export class PollRepository {
  private pollRepo: Repository<PollEntity>;
  private voteRepo: Repository<VoteEntity>;

  constructor() {
    this.pollRepo = AppDataSource.getRepository(PollEntity);
    this.voteRepo = AppDataSource.getRepository(VoteEntity);
  }

  async create(poll: Omit<Poll, 'id' | 'createdAt'>): Promise<void> {
    await this.pollRepo.query(
      `
      INSERT INTO polls (id, title, options, tags, "createdAt")
      VALUES (gen_random_uuid(), $1, $2, $3, NOW())
      `,
      [poll.title, poll.options, poll.tags]
    );
  }

  async find({
    tag,
    userId,
    skip,
    limit,
  }: {
    tag?: string;
    userId: string;
    skip: number;
    limit: number;
  }): Promise<Poll[]> {
    const query = `
      SELECT p.id, p.title, p.options, p.tags, p."createdAt"
      FROM polls p
      WHERE p.id NOT IN (
        SELECT v."pollId"
        FROM votes v
        WHERE v."userId" = $1
      )
      ${tag ? `AND $2 = ANY(p.tags)` : ''}
      ORDER BY p."createdAt" DESC
      OFFSET $3
      LIMIT $4
    `;
    const params = tag ? [userId, tag, skip, limit] : [userId, skip, limit];

    const result = await this.pollRepo.query(query, params);

    return result.map((row: any) => ({
      id: row.id,
      title: row.title,
      options: row.options,
      tags: row.tags,
      createdAt: row.createdAt,
    }));
  }

  async findById(id: string): Promise<Poll | null> {
    const [result] = await this.pollRepo.query(
      `
      SELECT id, title, options, tags, "createdAt"
      FROM polls
      WHERE id = $1
      `,
      [id]
    );

    if (!result) return null;

    return {
      id: result.id,
      title: result.title,
      options: result.options,
      tags: result.tags,
      createdAt: result.createdAt,
    };
  }

  async getUserDailyVoteCount(userId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const result = await this.voteRepo.query(
      `
      SELECT COUNT(*) as count
      FROM votes
      WHERE "userId" = $1
      AND "createdAt" >= $2
      AND "isSkip" = false
      `,
      [userId, startOfDay.toISOString()]
    );

    return parseInt(result[0].count, 10);
  }

  async recordVote(
    pollId: string,
    userId: string,
    optionIndex: number
  ): Promise<void> {
    await this.voteRepo.query(
      `
      INSERT INTO votes (id, "pollId", "userId", "optionIndex", "isSkip", "createdAt")
      VALUES (gen_random_uuid(), $1, $2, $3, false, NOW())
      `,
      [pollId, userId, optionIndex]
    );
  }

  async recordSkip(pollId: string, userId: string): Promise<void> {
    await this.voteRepo.query(
      `
      INSERT INTO votes (id, "pollId", "userId", "optionIndex", "isSkip", "createdAt")
      VALUES (gen_random_uuid(), $1, $2, NULL, true, NOW())
      `,
      [pollId, userId]
    );
  }

  async getVoteCounts(pollId: string): Promise<number[]> {
    const poll = await this.findById(pollId);
    if (!poll) throw new Error('Poll not found');

    const result = await this.voteRepo.query(
      `
      SELECT "optionIndex", COUNT(*) as count
      FROM votes
      WHERE "pollId" = $1
      AND "isSkip" = false
      GROUP BY "optionIndex"
      ORDER BY "optionIndex" ASC
      `,
      [pollId]
    );

    const counts: number[] = new Array(poll.options.length).fill(0);
    result.forEach((row: any) => {
      if (row.optionIndex !== null) {
        counts[row.optionIndex] = parseInt(row.count, 10);
      }
    });

    return counts;
  }
}
