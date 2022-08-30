import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';
import { ConfigService } from '@nestjs/config';
import bull, { Queue } from 'bull';

@Module({
  providers: [
    QueueService,
    {
      provide: 'queue',
      useFactory: (configService: ConfigService) => {
        return (name: string) => {
          return new bull(name, {
            redis: {
              host: configService.get<string>('REDIS_HOST'), //
              port: configService.get<number>('REDIS_PORT'),
              password: configService.get<string>('REDIS_PASSWORD'),
              db: configService.get<number>('REDIS_DB'),
            },
          });
        };
      },
      inject: [ConfigService],
    },
  ],
  exports: ['queue'],
})
export class QueueModule {}
