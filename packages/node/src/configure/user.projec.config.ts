// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

import { DataSourceFunc, QueueJobFunc } from '../types';

// the export 'handle' function from user project
const handle = 'handle';
// user project config file name
const manifest = 'project.yaml';

export type FileRoot = {
  path: string;
};

export enum DataBaseOrmKind {
  Prisma = 'prisma',
}

export interface DataSourceHandler extends HandlerMapping<HandlerKind.DataSource, DataSourceFunc> {
  forever: boolean;
}

export interface DataSource<H extends DataSourceHandler> extends FileRoot {
  handlers: H[];
}

export interface JonHandler extends HandlerMapping<HandlerKind.Queue, QueueJobFunc> {
  name: string;
}

export interface Queue<H extends JonHandler> extends FileRoot {
  handlers: H[];
}

export interface DbOrmMap<K extends string> {
  kind: K;
  schemaFile?: string;
  versionName?: string;
}

export type PrismaOrm = DbOrmMap<DataBaseOrmKind.Prisma>;

export type DbSchema = PrismaOrm | undefined;

export enum HandlerKind {
  DataSource = 'dataSource',
  Queue = 'queue',
}

export type HandlerMapping<K extends HandlerKind, F = Function> = {
  kind: K;
  handler: F;
  file: string;
};

export class UserProjectConfig {
  appName: string = '';
  rootPath: string = '';
  version: string = '';
  dbSchema?: DbSchema;
  queueHandler: Queue<JonHandler> | undefined;
  dataSourceHandler: DataSource<DataSourceHandler> | undefined;

  static async parse(app: string): Promise<UserProjectConfig> {
    if (fs.existsSync(app) == false) {
      throw new Error(`can't find user project file ${path}`);
    }

    const fsState = fs.statSync(app);

    if (fsState.isDirectory() == false) {
      throw new Error(`unknown project folder ${app}`);
    }

    let root = path.resolve(app);
    const manifestFile = path.resolve(root, manifest);

    let projectCfg = yaml.parse(fs.readFileSync(manifestFile, 'utf-8'));
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
async function queueHandler(root: string, content: any): Promise<Queue<JonHandler> | undefined> {
  if (content.queueHandlers === undefined) {
    return undefined;
  }
  let handlers: Queue<JonHandler> = {
    handlers: [],
    path: root,
  };

  content.queueHandlers.handlers.forEach((e) => {
    let file = path.resolve(root, e.file);
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
  let handlers: DataSource<DataSourceHandler> = {
    handlers: [],
    path: root,
  };
  content.dataSource.handlers.forEach((e) => {
    let file = path.resolve(root, e.file);
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
