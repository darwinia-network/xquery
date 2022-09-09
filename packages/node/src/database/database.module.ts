// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Module } from '@nestjs/common';
import { DatabaseOperate } from './database.operate';
import { DataSourceModule } from '../dataSource/datasource.module';
@Module({
  imports: [DataSourceModule],
  providers: [DatabaseOperate],
  exports: [DatabaseOperate],
})
export class DatabaseModule {}
