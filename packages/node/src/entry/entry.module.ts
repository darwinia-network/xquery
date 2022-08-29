import { Module } from '@nestjs/common';
import { EntryService } from './entry.service';

@Module({
  providers: [EntryService],
})
export class EntryModule {}
