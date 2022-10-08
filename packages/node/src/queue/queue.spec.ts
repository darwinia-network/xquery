// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { QueueProcess } from './queue.process';
import { QueueModule } from './queue.module';
import { UserProjectModule } from '../configure/user.project.module';
import { UserProjectConfig } from '../configure/user.projec.config';

describe('Queuer handler', () => {
  let module: TestingModule;
  let mockQueue: QueueProcess;
  const add = jest.fn();
  const process = jest.fn();
  const queueName = 'crab-queue';
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const importQueue = (string) => {
    return { add, process };
  };
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        QueueModule,
        UserProjectModule.register(__dirname),
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          load: [
            () => ({
              DB_DATABASE: '',
              DB_PASSWORD: '',
              DB_USER: '',
              DB_HOST: '',
              DB_PORT: 0,
            }),
          ],
        }),
      ],
      providers: [QueueProcess, ConfigService],
    })
      .overrideProvider('queue')
      .useValue(importQueue)
      .overrideProvider(UserProjectConfig)
      .useValue({
        appName: '',
        rootPath: '',
        version: '',
        queueHandler: {
          handlers: [
            {
              name: queueName,
              handle: () => undefined,
            },
          ],
        },
        entranceHandler: undefined,
      })
      .compile();

    mockQueue = module.get(QueueProcess);
  });

  afterAll(async () => await module.close());

  describe('test queue', () => {
    it('add a job', async () => {
      await mockQueue.addJob(queueName, {});
      expect(importQueue(queueName).add).toBeCalledTimes(1);
    });

    it('process a job', async () => {
      await mockQueue.onModuleInit();
      expect(importQueue(queueName).process).toBeCalledTimes(1);
    });
  });
});
