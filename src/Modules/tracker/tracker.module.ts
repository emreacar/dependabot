import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';
import { TrackerConsumer } from './tracker.consumer';
import { Tracker } from './entities/tracker.entity';
import { TRACKER_QUEUE, PROCESS_NAMES } from 'src/Core/Constants';

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
  ],
  controllers: [TrackerController],
  providers: [TrackerService, TrackerConsumer],
})
export class TrackerModule {}
