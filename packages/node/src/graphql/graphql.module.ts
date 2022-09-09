import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { GraphqlQueryService } from './graphql.query.service';
import { SchemaBuilderService } from './schemaBuilder.service';
@Module({
  imports: [DatabaseModule],
  providers: [GraphqlQueryService, SchemaBuilderService],
})
export class GraphqlModule {}
