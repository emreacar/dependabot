import { Job } from 'bull';
import { OnQueueCompleted, OnQueueFailed, Processor } from '@nestjs/bull';
import { TrackerService } from './tracker.service';
import { Tracker } from './entities/tracker.entity';
import { TRACKER_QUEUE } from 'src/Core/Constants';
import { TrackerResult } from 'src/Shared/types/tracker-result.type';
import { TrackerStatus } from 'src/Shared/types/tracker-status.type';

@Processor(TRACKER_QUEUE)
export class TrackerConsumer {
  constructor(private readonly trackerService: TrackerService) {}

  @OnQueueCompleted()
  async completed(job: Job<Tracker>, result: TrackerResult): Promise<void> {
    const tracker = job.data;

    const updateTracker = {
      trackerResult: result,
      status: TrackerStatus.Completed,
    };

    await this.trackerService.update(tracker.id, updateTracker);
    return;
  }

  @OnQueueFailed()
  async errored(job: Job<Tracker>, error: Error): Promise<void> {
    const tracker = job.data;

    const updateTracker = {
      trackerResult: { error: error.message },
      status: TrackerStatus.Errored,
    };

    await this.trackerService.update(tracker.id, updateTracker);
    return;
  }
}
