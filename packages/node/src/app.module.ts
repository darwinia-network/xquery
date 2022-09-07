import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { QueueModule } from './queue/queue.module';
import { EntryModule } from './entry/entry.module';
import { EntranceModule } from './configure/entrance.module';
import { DatabaseModule } from './database/database.module';
import { GraphqlModule } from './graphql/query.module';
import { ArenaModule } from './monitor/arena.module';
import { yargsOption } from './yargs';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    //
    EntranceModule.register(yargsOption.app),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'prod'}`],
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
    ArenaModule,
    EntryModule,
    QueueModule,
    DatabaseModule,
    GraphqlModule,
  ],
})
export class AppModule {}
