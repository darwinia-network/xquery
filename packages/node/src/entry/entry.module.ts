import { Module } from '@nestjs/common';
import { EntryService } from './entry.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  providers: [EntryService],
  imports: [QueueModule],
})
export class EntryModule {}
