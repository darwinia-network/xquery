import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueModule } from './queue/queue.module';
import { EntryModule } from './entry/entry.module';
import { ConfigureModule } from './configure/entrance.module';
import { join } from 'path';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigureModule.register(join(__dirname, '../../example')), // it's a test dir
    QueueModule,
    EntryModule,
  ],

  controllers: [],
})
export class AppModule {}
