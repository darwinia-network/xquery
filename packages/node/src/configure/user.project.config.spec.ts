// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import path from 'path';
import { UserProjectConfig } from './user.projec.config';

import { DataBaseOrmKind } from '@darwinia/xquery-type';
describe('Load config from user project ', () => {
  let example: string;

  beforeEach(() => {
    example = path.resolve(__dirname, '../../../example');
  });

  it('check manifest', async () => {
    const userProject = await UserProjectConfig.parse(example);
    userProject.rootPath;
    expect(userProject.version).toEqual('0.0.1');

    expect(userProject.rootPath).toEqual(example);
    expect(userProject.dbSchema).toMatchObject({
      kind: DataBaseOrmKind.Prisma,
      schemaFile: path.resolve(userProject.rootPath, './prisma/schema.prisma'),
      versionName: 'init',
    });

    expect(userProject.appName).toEqual('example');
    expect(userProject.queueHandler?.handlers[0].name).toEqual('pangoroDelivered');
    expect(userProject.dataSourceHandler?.handlers[0].file).toEqual(
      './src/dataSource/crabParachain.ts'
    );
  });
});
