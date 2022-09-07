import { DynamicModule, Module } from '@nestjs/common';
import { AreanService } from './arena.service';
import { ArenaOptions } from '../types';

@Module({
  providers: [AreanService],
  exports: [AreanService],
})
export class ArenaModule {}
