import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueModule } from './queue/queue.module';
import { EntryModule } from './entry/entry.module';
import { EntranceModule } from './configure/entrance.module';

import { join } from 'path';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    EntranceModule.register(join(__dirname, '../../example')), // it's a test dir
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'prod'}`],
    }),

    EntryModule,
    QueueModule,
  ],

  controllers: [],
})
export class AppModule {}
