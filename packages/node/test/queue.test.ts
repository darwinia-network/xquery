// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Test, TestingModule } from '@nestjs/testing';
import { QueueProcess } from '../src/queue/queue.process';
import { QueueModule } from '../src/queue/queue.module';
import { UserProjectModule } from '../src/configure/user.project.module';
import { UserProjectConfig } from '../src/configure/user.projec.config';

describe('EnqueuerService', () => {
  let module: TestingModule;
  let mockQueue: QueueProcess;
  let userCfg: UserProjectConfig;
  let add = jest.fn();
  let process = jest.fn();
  const queueName = 'crab-queue';
  const importQueue = (string) => {
    return { add, process };
  };
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [QueueModule, UserProjectModule.register(__dirname)],
      providers: [QueueProcess],
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
              handle: () => {},
            },
          ],
        },
        dataSourceHandler: undefined,
      })
      .compile();

    mockQueue = module.get(QueueProcess);
    userCfg = module.get(UserProjectConfig);
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
