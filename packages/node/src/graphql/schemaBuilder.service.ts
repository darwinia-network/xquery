import { Injectable, Logger } from '@nestjs/common';
import { GraphQLSchema } from 'graphql';
import { Pool } from 'pg';
import { createPostGraphQLSchema, PostGraphileOptions } from 'postgraphile';
import { DatabaseService } from '../database/database.service';
import { plugins } from './plugins';

@Injectable()
export class SchemaBuilderService {
  private readonly logger = new Logger(SchemaBuilderService.name);

  private driver: Pool;
  constructor(public databaseService: DatabaseService) {
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
