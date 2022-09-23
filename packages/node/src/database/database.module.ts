// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Module } from '@nestjs/common';
import { DatabaseOperate } from './database.operate';
import { EntranceModule } from '../Entrance/entrance.module';
@Module({
  imports: [EntranceModule],
  providers: [DatabaseOperate],
  exports: [DatabaseOperate],
})
export class DatabaseModule {}
