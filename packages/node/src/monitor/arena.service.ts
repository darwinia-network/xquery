import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { ArenaOptions } from '../types';
import { UserProjectConifg } from '../configure/user.projec.config';
import { yargsOption } from '../yargs';
import Arena from 'bull-arena';
import Bull from 'bull';

const queuePath = '/queue';

@Injectable()
export class AreanService implements OnModuleInit {
  private readonly options: ArenaOptions = { queues: [], listenOptions: {} };

  private readonly logger = new Logger(AreanService.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly userProjectConifg: UserProjectConifg,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    if (this.httpAdapterHost.httpAdapter && yargsOption.monitor) {
      this.logger.log('start queue monitor service');
      this.userProjectConifg.JobHandler?.handlers.forEach((h, _) => {
        this.options.queues.push({
          name: h.name,
          type: 'bull', // default
          hostId: 'worker',
          host: this.configService.get<string>('REDIS_HOST') ?? '', //
          port: this.configService.get<number>('REDIS_PORT'),
          password: this.configService.get<string>('REDIS_PASSWORD'),
          db: this.configService.get<string>('REDIS_DB'),
        });

        this.options.listenOptions = {
          basePath: queuePath,
          disableListen: true,
        };
      });

      this.httpAdapterHost.httpAdapter.getInstance().use(
        Arena(
          {
            Bull,
            queues: this.options.queues,
          },
          this.options.listenOptions
        )
      );
    }
  }
}
