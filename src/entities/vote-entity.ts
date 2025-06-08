import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PollEntity } from './poll-entity';

@Entity('votes')
@Index('idx_votes_pollId_userId', ['pollId', 'userId'], { unique: true }) // Ensure one interaction per user per poll
@Index('idx_votes_userId_createdAt', ['userId', 'createdAt']) // For daily vote limit checks
@Index('idx_votes_pollId_optionIndex', ['pollId', 'optionIndex']) // For vote counting
export class VoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pollId: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  optionIndex: number | null; // Null for skips

  @Column({ default: false })
  isSkip: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => PollEntity, poll => poll.votes, {
    onDelete: 'CASCADE', // Delete votes if associated poll is deleted
  })
  @JoinColumn({ name: 'pollId' })
  poll: PollEntity;
}
