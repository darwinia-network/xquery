// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common';

import { UserProjectConfig } from '../configure/user.projec.config';
import { BullQueue, QueueJobFunc, QueueHandler } from '@darwinia/xquery-type';

const concurrentCount = 10;

@Injectable()
export class QueueProcess implements OnModuleInit {
  private readonly logger = new Logger(QueueProcess.name);
  private queueNames: string[] = [];
  constructor(
    private userProjectConfig: UserProjectConfig,
    @Inject('queue') private queue: BullQueue
  ) {}

  async onModuleInit() {
    this.userProjectConfig.queueHandler?.handlers.forEach((h) => {
      this.queueNames.push(h.name);
      this.start(h.name, h.handler);
    });
  }

  private async handle(handler: QueueJobFunc, params: any): Promise<QueueHandler> {
    try {
      const result = await handler(params);
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

  async addJob(queueName: string, data: unknown): Promise<void> {
    await this.queue(queueName).add(data, {
      timeout: 60 * 60 * 1000,
      removeOnFail: true,
    });
  }
}
