import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import bull from 'bull';
import { Handlers } from '../configure/handlers';
import { InjectQueue } from '@nestjs/bull';

import { bullQueue } from '../types';

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(
    private handlerCfg: Handlers,
    @Inject('queue') private queue: bullQueue,
  ) {}

  async onModuleInit() {
    // mapping developer's handler function into queue
    this.handlerCfg.handlerCfg.forEach((item, idx) => {
      this.start(item.file, item.handler);
    });
  }

  private async handle(handler: any, params: any): Promise<any> {
    try {
      let result = await handler(params);
      if (result && result.nextHandler?.name) {
        return {
          name: result.nextHandler.name,
          params: result.nextHandler.params || {},
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

  private async start(queueName: string, handler: any) {
    this.queue(queueName).process(10, async (job) => {
      // note

      try {
        const nextJob = await this.handle(handler, job.data);

        if (nextJob === undefined) {
          return;
        }

        if (nextJob.name === queueName) {
          console.log('same queue');
          return;
        }

        await this.addJob(nextJob.name, nextJob.params);
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
