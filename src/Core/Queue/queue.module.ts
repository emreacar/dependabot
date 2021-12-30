import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('queue.host'),
          port: +configService.get('queue.port'),
        },
        prefix: 'dbot',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class QueueModule extends BullModule {}
