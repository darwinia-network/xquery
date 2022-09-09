// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { GraphqlQueryService } from './graphql.query.service';
import { SchemaBuilder } from './schema.builder';
@Module({
  imports: [DatabaseModule],
  providers: [GraphqlQueryService, SchemaBuilder],
})
export class GraphqlModule {}
