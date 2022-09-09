import childProcess from 'child_process';
import { Injectable, OnApplicationShutdown, OnModuleInit, Inject, Logger } from '@nestjs/common';

import { UserProjectConfig, DataBaseOrmKind } from '../configure/user.projec.config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { sleep } from '../utils/utils';

import { BullQueue, DataSourceFunc } from '../types';

@Injectable()
export class DataSourceService implements OnModuleInit, OnApplicationShutdown {
  private isShutdown = false;
  private readonly logger = new Logger(DataSourceService.name);

  constructor(
    private userProjectConfig: UserProjectConfig,
    @Inject('queue') private queue: BullQueue
  ) {}

  onApplicationShutdown() {
    this.isShutdown = true;
  }

  async onModuleInit() {
    await this.init();
  }

  private async runForever(func: DataSourceFunc) {
    while (!this.isShutdown) {
      await sleep(1);
      await func(async (queueName: string | undefined, data: unknown) => {
        if (queueName === undefined) {
          return;
        }
        let queue = this.queue(queueName);
        await queue.add(data, {
          timeout: 60 * 60 * 1000,
          removeOnFail: true,
        });
      });
    }
  }
  private async init(): Promise<void> {
    if (this.userProjectConfig.dbSchema) {
      try {
        this.logger.log('start to migrate user database table');
        if (this.userProjectConfig.dbSchema.kind == DataBaseOrmKind.Prisma) {
          const migrateCommand = `npx prisma migrate dev --name ${this.userProjectConfig.dbSchema.versionName} --schema ${this.userProjectConfig.dbSchema.schemaFile} `;
          childProcess.execSync(migrateCommand).toString();
        } else {
          this.logger.error(`unkown orm kind`);
        }
      } catch (e) {
        this.logger.error(e);
        throw new Error('failed to migrate database table');
      }
    }
    this.userProjectConfig.dataSourceHandler?.handlers.forEach(async (h, _) => {
      if (h.handler === undefined) {
        return;
      }

      if (h.forever) {
        this.runForever(h.handler);
        return;
      }

      await h.handler(async (queueName: string | undefined, data: unknown) => {
        if (queueName === undefined) {
          return;
        }
        let queue = this.queue(queueName);
        await queue.add(data, {
          timeout: 60 * 60 * 1000,
          removeOnFail: true,
        });
      });
    });
  }
}
