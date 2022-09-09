// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Module } from '@nestjs/common';
import { AreanService } from './arena.service';

@Module({
  providers: [AreanService],
})
export class ArenaModule {}
