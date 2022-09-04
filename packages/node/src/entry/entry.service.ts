import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
  Inject,
} from '@nestjs/common';

import { UserProjectConifg } from '../configure/user.projec.config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectQueue, getQueueToken } from '@nestjs/bull';
import { add } from 'lodash';
import { sleep } from '../utils/utils';
import { threadId } from 'worker_threads';
import { print } from 'graphql';
import utils from 'util';
import {} from '../types';

import { bullQueue, produceFunc } from '../types';

@Injectable()
export class EntryService implements OnModuleInit, OnApplicationShutdown {
  private isShutdown = false;
  constructor(
    private userProjectConifg: UserProjectConifg,
    private schedulerRegistry: SchedulerRegistry,
    @Inject('queue') private queue: bullQueue,
  ) {}

  onApplicationShutdown() {
    this.isShutdown = true;
  }

  async onModuleInit() {
    await this.init();
  }

  private async runForever(func: produceFunc) {
    while (!this.isShutdown) {
      await sleep(1);

      await func(async (handleJobName: string | undefined, data: any) => {
        if (handleJobName === undefined) {
          return;
        }
        let aqueue = this.queue(handleJobName);
        await aqueue.add(data);
      });
    }
  }
  private async init(): Promise<void> {
    this.userProjectConifg.ProcessHandler?.handlers.forEach(async (h, idx) => {
      if (h.forever) {
        this.runForever(h.handler);
        return;
      }
      console.log('---> ', h.file);
      if (h.handler === undefined) {
        return;
      }
      await h.handler(async (handleJobName: string | undefined, data: any) => {
        if (handleJobName === undefined) {
          return;
        }
        let aqueue = this.queue(handleJobName);
        await aqueue.add(data);
      });
    });
  }
}
