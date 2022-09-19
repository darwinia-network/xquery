// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

import {
  DataSourceFunc,
  QueueJobFunc,
  DbSchema,
  JonHandler,
  DataSourceHandler,
  DataSource,
  HandlerKind,
  DataBaseOrmKind,
  QueueProcess,
} from '@darwinia/xquery-type';

// the export 'handle' function from user project
const handle = 'handle';
// user project config file name
const manifest = 'project.yaml';

export class UserProjectConfig {
  appName = '';
  rootPath = '';
  version = '';
  dbSchema?: DbSchema;
  queueHandler: QueueProcess<JonHandler> | undefined;
  dataSourceHandler: DataSource<DataSourceHandler> | undefined;

  static async parse(app: string): Promise<UserProjectConfig> {
    if (fs.existsSync(app) == false) {
      throw new Error(`can't find user project file ${path}`);
    }

    const fsState = fs.statSync(app);

    if (fsState.isDirectory() == false) {
      throw new Error(`unknown project folder ${app}`);
    }

    const root = path.resolve(app);
    const manifestFile = path.resolve(root, manifest);

    const projectCfg = yaml.parse(fs.readFileSync(manifestFile, 'utf-8'));
    if (projectCfg === undefined) {
      throw new Error(`failed to load config ${projectCfg}`);
    }

    return {
      appName: projectCfg.name,
      rootPath: root,
      version: projectCfg.version,
      dbSchema: await dbSchema(root, projectCfg),
      queueHandler: await queueHandler(root, projectCfg),
      dataSourceHandler: await dataSourceHandlerr(root, projectCfg),
    };
  }
}
async function queueHandler(
  root: string,
  content: any
): Promise<QueueProcess<JonHandler> | undefined> {
  if (content.queueHandlers === undefined) {
    return undefined;
  }
  const handlers: QueueProcess<JonHandler> = {
    handlers: [],
    path: root,
  };

  content.queueHandlers.handlers.forEach((e) => {
    const file = path.resolve(root, e.file);
    /* eslint @typescript-eslint/no-var-requires: "off" */
    const h = require(`${file}`);

    let queueName = path.basename(file);
    queueName = queueName.substring(0, queueName.lastIndexOf('.'));

    handlers.handlers.push({
      file: e.file as unknown as string,
      handler: h[handle] as unknown as QueueJobFunc,
      name: queueName,
      kind: HandlerKind.Queue,
    });
  });

  return handlers;
}

async function dataSourceHandlerr(
  root: string,
  content: any
): Promise<DataSource<DataSourceHandler> | undefined> {
  if (content.dataSource === undefined) {
    return undefined;
  }
  const handlers: DataSource<DataSourceHandler> = {
    handlers: [],
    path: root,
  };
  content.dataSource.handlers.forEach((e) => {
    const file = path.resolve(root, e.file);
    const h = require(`${file}`);
    handlers.handlers.push({
      file: e.file as unknown as string,
      handler: h[handle] as unknown as DataSourceFunc,
      kind: HandlerKind.DataSource,
      forever: true,
    });
  });

  return handlers;
}

async function dbSchema(root: string, content: any): Promise<DbSchema | undefined> {
  if (content.dbSchema) {
    return {
      kind: DataBaseOrmKind[content.dbSchema.kind as unknown as string],
      schemaFile: path.resolve(root, content.dbSchema.file),
      versionName: content.dbSchema.migrateVersionName as unknown as string,
    };
  }

  return undefined;
}
