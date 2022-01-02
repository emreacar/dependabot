import { Queue } from 'bull';
import { FindManyOptions, In, Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Tracker } from './entities/tracker.entity';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { PROCESS_NAMES, TRACKER_QUEUE } from 'src/Core/Constants';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { TrackerStatus } from 'src/Shared/types/tracker-status.type';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Tracker)
    private readonly trackerRepository: Repository<Tracker>,
    @InjectQueue(TRACKER_QUEUE) private trackerQueue: Queue,
  ) {}

  getOne(trackerId: string): Promise<Tracker> {
    return this.trackerRepository.findOneOrFail(trackerId);
  }

  getByStatus(statusList: TrackerStatus[]): Promise<Tracker[]> {
    return this.trackerRepository.find({
      where: {
        status: In(statusList),
      },
    });
  }

  async create(trackerDTO: CreateTrackerDto): Promise<Tracker> {
    const tracker = await this.trackerRepository.save(trackerDTO);

    /**
     * A new request has been created. We queue the process.
     */
    await this.trackerQueue.add(PROCESS_NAMES.checkDependency, tracker);

    return tracker;
  }

  update(
    trackerId: string,
    trackerDTO: UpdateTrackerDto,
  ): Promise<UpdateResult> {
    return this.trackerRepository.update(trackerId, trackerDTO);
  }

  async unSubscribe(trackerId: string): Promise<UpdateResult> {
    const update = await this.trackerRepository.update(trackerId, {
      status: TrackerStatus.UnSubscribed,
    });

    return update;
  }
}
