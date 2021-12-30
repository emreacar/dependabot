import configuration from './config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './Core/Database/database.module';
import { QueueModule } from './Core/Queue/queue.module';
import { AppController } from './app.controller';
import { TrackerModule } from './Modules/tracker/tracker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    DatabaseModule,
    QueueModule,
    TrackerModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
