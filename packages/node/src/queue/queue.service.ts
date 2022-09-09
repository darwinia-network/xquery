import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import bull from 'bull';
import { UserProjectConfig } from '../configure/user.projec.config';
import { InjectQueue } from '@nestjs/bull';

import { BullQueue, QueueJobFunc, QueueHandler } from '../types';

const concurrentCount = 10;

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);
  private queueNames: string[] = [];
  constructor(
    private userProjectConfig: UserProjectConfig,
    @Inject('queue') private queue: BullQueue
  ) {}

  async onModuleInit() {
    this.userProjectConfig.queueHandler?.handlers.forEach((h, _) => {
      this.queueNames.push(h.name);
      this.start(h.name, h.handler);
    });
  }

  private async handle(handler: QueueJobFunc, params: any): Promise<QueueHandler> {
    try {
      let result = await handler(params);
      if (result && result?.queueName) {
        return {
          queueName: result.queueName,
          data: result.data || {},
        };
      }
    } catch (error) {
      this.logger.error(`queue process data error ${error}`);
      throw new Error((error as Error).message);
    }
  }

  private async start(queueName: string, handler: QueueJobFunc) {
    this.queue(queueName).process(concurrentCount, async (job) => {
      try {
        const nextHandle = await this.handle(handler, job.data);

        if (nextHandle === undefined) {
          return;
        }

        if (this.queueNames.includes(nextHandle.queueName) == false) {
          this.logger.error(
            `unkown worker ${nextHandle.queueName}, please check your handler file`
          );
          return;
        }
        if (nextHandle.queueName === queueName) {
          this.logger.error(`ignore putting data to same worker ${nextHandle.queueName}`);
          return;
        }
        if (nextHandle.queueName) await this.addJob(nextHandle.queueName, nextHandle.data);
      } catch (err) {
        this.logger.error(err);
        throw new Error((err as Error).message);
      }
    });
    this.logger.log(`create ${queueName} worker`);
  }

  private async addJob(queueName: string, data: unknown): Promise<void> {
    await this.queue(queueName).add(data, {
      timeout: 60 * 60 * 1000,
      removeOnFail: true,
    });
  }
}
