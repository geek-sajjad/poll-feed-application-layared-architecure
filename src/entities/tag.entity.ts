import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { PollEntity } from './poll-entity';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => PollEntity, poll => poll.tags)
  polls: PollEntity[];
}
