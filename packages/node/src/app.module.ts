// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { QueueModule } from './queue/queue.module';
import { DataSourceModule } from './dataSource/datasource.module';
import { UserProjectModule } from './configure/user.project.module';
import { DatabaseModule } from './database/database.module';
import { GraphqlModule } from './graphql/graphql.module';
import { yargsOption } from './yargs';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    //
    UserProjectModule.register(yargsOption.app),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'prod'}`],
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),

    DataSourceModule,
    QueueModule,
    DatabaseModule,
    GraphqlModule,
  ],
})
export class AppModule {}
