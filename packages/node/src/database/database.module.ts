import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DataSourceModule } from '../dataSource/datasource.module';
@Module({
  imports: [DataSourceModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
