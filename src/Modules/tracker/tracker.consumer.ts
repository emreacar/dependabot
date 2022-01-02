import * as dayjs from 'dayjs';
import { Job, Queue } from 'bull';
import {
  InjectQueue,
  OnQueueCompleted,
  OnQueueFailed,
  Processor,
} from '@nestjs/bull';
import { MailService } from 'src/Core/Mail/mail.service';
import { TrackerService } from './tracker.service';
import { Tracker } from './entities/tracker.entity';
import { PROCESS_NAMES, TRACKER_QUEUE } from 'src/Core/Constants';
import { TrackerResult } from 'src/Shared/types/tracker-result.type';
import { TrackerStatus } from 'src/Shared/types/tracker-status.type';

@Processor(TRACKER_QUEUE)
export class TrackerConsumer {
  constructor(
    @InjectQueue(TRACKER_QUEUE) private trackerQueue: Queue,
    private readonly trackerService: TrackerService,
    private readonly mailService: MailService,
  ) {}

  async removeCurrentQueue(): Promise<void> {
    const repeatableJobs = await this.trackerQueue.getRepeatableJobs();

    await Promise.all(
      repeatableJobs.map((job) =>
        this.trackerQueue.removeRepeatableByKey(job.key),
      ),
    );

    return;
  }

  async createTrackerQueue(): Promise<Job<Tracker>[]> {
    const trackers = await this.trackerService.getByStatus([
      TrackerStatus.Completed,
    ]);

    return Promise.all(
      trackers.map((tracker) => this.makeJobRepeatable(tracker)),
    );
  }

  @OnQueueCompleted()
  async completed(job: Job<Tracker>, result: TrackerResult): Promise<void> {
    const tracker = await this.trackerService.getOne(job.data.id);

    if (tracker.status === TrackerStatus.UnSubscribed) return;

    const updateTracker = {
      trackerResult: result,
      status: TrackerStatus.Completed,
    };

    await this.trackerService.update(tracker.id, updateTracker);

    console.log(tracker);
    //Send Notification Mail
    await this.mailService.send({
      to: tracker.emails.join(', '),
      subject: 'Outdated Dependency Warning',
      template: 'dependency-warning.hbs',
      context: {
        ...tracker,
        ...updateTracker,
      },
    });

    /**
     * TrackerStatus === Waiting -> First Successfull Run.
     */
    if (tracker.status === TrackerStatus.Waiting)
      await this.makeJobRepeatable(tracker);
  }

  @OnQueueFailed()
  async errored(job: Job<Tracker>, error: Error): Promise<void> {
    const tracker = job.data;

    const updateTracker = {
      trackerResult: { error: error.message },
      status: TrackerStatus.Errored,
    };

    /**
     * @Todo We have to customize the behavior according to the error type.
     */

    await this.trackerService.update(tracker.id, updateTracker);
    return;
  }

  makeJobRepeatable(tracker: Tracker): Promise<Job<Tracker>> {
    const trackerCreateDate = dayjs(tracker.createdAt);

    return this.trackerQueue.add(PROCESS_NAMES.checkDependency, tracker, {
      repeat: {
        cron: `${trackerCreateDate.get('minute')} ${trackerCreateDate.get(
          'hour',
        )} * * *`,
      },
    });
  }
}
