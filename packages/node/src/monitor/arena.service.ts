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
          type: 'bull',
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

      this.logger.log('arenas', this.options);

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

// import Arena from 'bull-arena';
// import express from 'express';

// const app = express();
// const router = express.Router();
// // inject prodiver  todo
// const arena = Arena(
//   {
//     queues: [
//       {
//         // Required for each queue definition.
//         name: 'pangoro-handleSourceChain',

//         // User-readable display name for the host. Required.
//         hostId: 'Server 1',

//         // Queue type (Bull or Bee - default Bull).
//         type: 'bee',
//         host: '47.243.92.91',
//         port: 6379,
//         db: '5',
//         password: '4d1ecc8ef3e8290',
//       },
//       {
//         // Required for each queue definition.
//         name: 'pangoro-handleDelivered',

//         // User-readable display name for the host. Required.
//         hostId: 'Server 1',

//         // Queue type (Bull or Bee - default Bull).
//         type: 'bee',
//         host: '47.243.92.91',
//         port: 6379,
//         db: '5',
//         password: '4d1ecc8ef3e8290',
//       },
//       {
//         // Required for each queue definition.
//         name: 'pangolin-handleDispached',

//         // User-readable display name for the host. Required.
//         hostId: 'Server 1',

//         // Queue type (Bull or Bee - default Bull).
//         type: 'bee',

//         host: '47.243.92.91',
//         port: 6379,
//         db: '5',
//         password: '4d1ecc8ef3e8290',
//       },
//     ],
//   },
//   {
//     // Make the arena dashboard become available at {my-site.com}/arena.
//     basePath: '/arena',

//     // Let express handle the listening.
//     disableListen: true,
//   },
// );

// router.use('/', arena);
// app.use(router);

// app.listen(2000, () => {
//   console.log('Ready, http://localhost:2000/arena');
// });