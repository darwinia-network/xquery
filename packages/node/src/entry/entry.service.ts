import childProcess from 'child_process';
import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
  Inject,
} from '@nestjs/common';

import {
  UserProjectConifg,
  DataBaseOrmKind,
} from '../configure/user.projec.config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { sleep } from '../utils/utils';
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
    if (this.userProjectConifg.dbSchema) {
      try {
        if (this.userProjectConifg.dbSchema.kind == DataBaseOrmKind.Prisma) {
          const runCommand = `npx prisma migrate dev --name ${this.userProjectConifg.dbSchema.versionName} --schema ${this.userProjectConifg.dbSchema.schemaFile} `;
          const result = childProcess.execSync(runCommand).toString();
          console.log(result);
        }
      } catch (e) {
        // logger
        console.log(e);
        throw new Error('failed to init db');
      }
    }
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
