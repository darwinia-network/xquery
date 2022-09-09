import { Module } from '@nestjs/common';
import { AreanService } from './arena.service';

@Module({
  providers: [AreanService],
})
export class ArenaModule {}
