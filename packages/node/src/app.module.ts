import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { QueuModel } from './queue/queue.module';

@Module({
  imports: [ScheduleModule.forRoot(), QueuModel],

  controllers: [],
})
export class AppModule {}
