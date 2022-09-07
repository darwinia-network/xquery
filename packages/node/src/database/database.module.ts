import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { EntryModule } from '../entry/entry.module';
@Module({
  imports: [EntryModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
