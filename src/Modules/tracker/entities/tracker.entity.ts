import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RepoProvider } from 'src/Shared/types/provider.type';
import { TrackerStatus } from 'src/Shared/types/tracker-status.type';
import { TrackerResult } from 'src/Shared/types/tracker-result.type';

@Entity()
export class Tracker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: RepoProvider;

  @Column()
  username: string;

  @Column()
  repository: string;

  @Column('jsonb', { default: {} })
  trackerResult?: TrackerResult;

  @Column('numeric', { default: TrackerStatus.Waiting })
  status: TrackerStatus;

  @Column('jsonb')
  emails: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
