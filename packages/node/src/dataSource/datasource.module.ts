// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Module } from '@nestjs/common';
import { DataSourceProcess } from './datasource.process';
import { QueueModule } from '../queue/queue.module';

@Module({
  providers: [DataSourceProcess],
  imports: [QueueModule],
})
export class DataSourceModule {}
