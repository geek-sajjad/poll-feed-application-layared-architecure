import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { VoteEntity } from './vote-entity';
import { TagEntity } from './tag.entity';

@Entity('polls')
// @Index('idx_polls_createdAt', ['createdAt']) // For sorting by recency
// @Index('idx_polls_tags', ['tags']) // For tag-based filtering
export class PollEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('simple-array') //Note: the typeorm does not support Array of string type for postgres, so we have to manually edit the migration file, the json type is temp.
  options: string[];

  // @Column('jsonb')
  // tags: string[];

  @ManyToMany(() => TagEntity, tag => tag.polls, { cascade: true })
  @JoinTable({
    name: 'poll_tags',
    joinColumn: { name: 'pollId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: TagEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => VoteEntity, vote => vote.poll)
  votes: VoteEntity[];
}
