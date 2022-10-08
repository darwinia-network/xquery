// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Injectable, Logger } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { Pool } from 'pg';
import { createPostGraphQLSchema, PostGraphileOptions } from 'postgraphile';
import { DatabaseOperate } from '../database/database.operate';
import { plugins } from './plugins';

@Injectable()
export class SchemaBuilder {
  private readonly logger = new Logger(SchemaBuilder.name);

  private driver: Pool;
  constructor(public databaseService: DatabaseOperate) {
    this.driver = this.databaseService.getPgPool();
  }
  getOptions(): PostGraphileOptions {
    return {
      replaceAllPlugins: plugins,
      dynamicJson: true,
      enableTags: true,
      ignoreRBAC: false,
    };
  }

  async buildSchema(schema: string): Promise<GraphQLSchema> {
    try {
      this.logger.log('transfer database schema to graphql schema');
      const dbSchema = await this.databaseService.getSchema(schema);
      const graphqlSchema = await createPostGraphQLSchema(this.driver, dbSchema, this.getOptions());
      return graphqlSchema;
    } catch (error) {
      this.logger.error(`create graphql schema ${schema} failed ${error}`);
      process.exit(1);
    }
  }

  async buildAppolo(schema: string): Promise<Record<string, unknown>> {
    return {
      schema: await this.buildSchema(schema),
      playground: true,
      context: {
        pgClient: this.driver,
      },
      debug: process.env.NODE_ENV !== 'production',
      pulgins: [],
    };
  }
}
