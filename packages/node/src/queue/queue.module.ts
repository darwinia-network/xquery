import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: '47.243.92.91', //
        port: 6379,
        password: '4d1ecc8ef3e8290',
        db: 5,
      },
    }),
  ],
  providers: [QueueService],
})
export class QueueModule {}
