import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Inject,
} from '@nestjs/common';

import { Handlers } from '../configure/handlers';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectQueue, getQueueToken } from '@nestjs/bull';
import { add } from 'lodash';
import { sleep } from '../utils/utils';
import { threadId } from 'worker_threads';
import { print } from 'graphql';
import utils from 'util';

import { bullQueue } from '../types';

@Injectable()
export class EntryService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private handler: Handlers,
    private schedulerRegistry: SchedulerRegistry,
    @Inject('queue') private queue: bullQueue,
  ) {}
  onModuleDestroy() {
    try {
      let keys = this.schedulerRegistry.getIntervals();
      keys.forEach((v, i) => {
        this.schedulerRegistry.deleteInterval(v);
      });
    } catch (error) {}
  }
  async onModuleInit() {
    await this.init();
  }

  private async init(): Promise<void> {
    // warning: fixed interval is not good way  (todo)
    this.handler.entryCfg.forEach((item, idx) => {
      this.schedulerRegistry.addInterval(
        `${item.file}-${idx}`,
        setInterval(
          async () =>
            // execute developer's function
            void (await item.handler(async (queue: string, data: any) => {
              // push data into queue
              let aqueue = this.queue(queue);
              await aqueue.add(data);
            })),
          5000,
        ),
      );
    });
  }
}
