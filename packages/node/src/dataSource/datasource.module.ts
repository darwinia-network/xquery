import { Module } from '@nestjs/common';
import { DataSourceService } from './datasource.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  providers: [DataSourceService],
  imports: [QueueModule],
})
export class DataSourceModule {}
