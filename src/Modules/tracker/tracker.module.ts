import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';
import { TrackerConsumer } from './tracker.consumer';
import { Tracker } from './entities/tracker.entity';
import { TRACKER_QUEUE, PROCESS_NAMES } from 'src/Core/Constants';
import { MailModule } from 'src/Core/Mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tracker]),
    BullModule.registerQueue({
      name: TRACKER_QUEUE,
      processors: [
        {
          name: PROCESS_NAMES.checkDependency,
          path: join(
            __dirname,
            `process/${PROCESS_NAMES.checkDependency}.process.js`,
          ),
        },
      ],
    }),
    MailModule,
  ],
  controllers: [TrackerController],
  providers: [TrackerService, TrackerConsumer],
})
export class TrackerModule implements OnApplicationBootstrap {
  constructor(private readonly trackerConsumer: TrackerConsumer) {}

  /**
   * Reconfigures the queue when the application starts.
   */
  async onApplicationBootstrap(): Promise<void> {
    // Clear Queue Firstly.
    await this.trackerConsumer.removeCurrentQueue();

    // Then Re-create jobs
    await this.trackerConsumer.createTrackerQueue();
    return;
  }
}
