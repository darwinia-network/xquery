// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { ArenaOptions } from '../types';
import { UserProjectConfig } from '../configure/user.projec.config';
import { yargsOption } from '../yargs';
import Arena from 'bull-arena';
import Bull from 'bull';

const queueURIPath = '/queue';

@Injectable()
export class AreanService implements OnModuleInit {
  private readonly options: ArenaOptions = { queues: [], listenOptions: {} };

  private readonly logger = new Logger(AreanService.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly userProjectConfig: UserProjectConfig,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    if (this.httpAdapterHost.httpAdapter && yargsOption.monitor) {
      this.logger.log('start queue monitor service');
      this.userProjectConfig.queueHandler?.handlers.forEach((h, _) => {
        this.options.queues.push({
          name: h.name,
          type: 'bull', // use Bull here
          hostId: 'worker', // default name
          host: this.configService.get<string>('REDIS_HOST') ?? '', //
          port: this.configService.get<number>('REDIS_PORT'),
          password: this.configService.get<string>('REDIS_PASSWORD'),
          db: this.configService.get<string>('REDIS_DB'),
        });

        this.options.listenOptions = {
          basePath: queueURIPath,
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
