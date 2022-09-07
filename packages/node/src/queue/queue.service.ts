import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import bull from 'bull';
import { UserProjectConifg } from '../configure/user.projec.config';
import { InjectQueue } from '@nestjs/bull';

import { bullQueue, jobFunc, NextJonHandler } from '../types';

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(
    private userProjectConifg: UserProjectConifg,
    @Inject('queue') private queue: bullQueue
  ) {}

  async onModuleInit() {
    this.userProjectConifg.JobHandler?.handlers.forEach((h, idx) => {
      this.start(h.name, h.handler);
    });
  }

  private async handle(handler: jobFunc, params: any): Promise<NextJonHandler> {
    try {
      let result = await handler(params);
      if (result && result?.name) {
        return {
          name: result.name,
          data: result.data || {},
        };
      }
      return;
    } catch (error) {
      // todo logger
    }
  }
  /**
   *
   * @param queueName
   * @param handler
   */

  private async start(queueName: string, handler: jobFunc) {
    this.queue(queueName).process(10, async (job) => {
      // note
      // console.log(`call back data ${job.id}`);
      try {
        const nextJob = await this.handle(handler, job.data);

        if (nextJob === undefined) {
          return;
        }

        if (nextJob.name === queueName) {
          console.log('same queue');
          return;
        }

        await this.addJob(nextJob.name, nextJob.data);
      } catch (err) {
        console.error(err);
      }

      return { ok: true };
    });
    console.log(`${queueName} handler is running`);
  }

  private async addJob(queueName: string, params: any): Promise<void> {
    await this.queue(queueName).add(params, {
      timeout: 60 * 60 * 1000,
      removeOnFail: true,
    });
  }
}

// should be a global value  todo
export let localHandeNameSet = new Set<string>('');
