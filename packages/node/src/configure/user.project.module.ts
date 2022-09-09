// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Module, Global, DynamicModule } from '@nestjs/common';
import fs from 'fs';
import { UserProjectConfig } from './user.projec.config';
@Global()
@Module({})
export class UserProjectModule {
  public static register(appFile: string): DynamicModule {
    var stat = fs.statSync(appFile);
    if (stat.isDirectory() == false) {
      process.exit(1);
    }

    const yamlCfg = async () => {
      return await UserProjectConfig.parse(appFile);
    };

    return {
      module: UserProjectModule,
      providers: [
        {
          provide: UserProjectConfig,
          useFactory: yamlCfg,
        },
      ],
      exports: [UserProjectConfig],
    };
  }
}
