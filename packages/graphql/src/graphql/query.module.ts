import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { QueryService } from './query.service';
import { SchemaBuilderService } from './schemaBuilder.service';
@Module({
  imports: [DatabaseModule],
  providers: [QueryService, SchemaBuilderService],
})
export class graphqlModule {}
