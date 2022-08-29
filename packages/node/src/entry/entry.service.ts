import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import bull from 'bull';
import { Handlers } from '../configure/handlers';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class EntryService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private handler: Handlers,
    private schedulerRegistry: SchedulerRegistry,
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
              let job = await new bull(queue, {
                redis: {
                  host: '47.243.92.91',
                  port: 6379,
                  password: '4d1ecc8ef3e8290',
                  db: 5,
                },
              }).add(data);
            })),
          5000,
        ),
      );
    });
  }
}
