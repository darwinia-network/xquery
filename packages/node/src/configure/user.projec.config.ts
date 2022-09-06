import fs from 'fs';
import util from 'util';
import path from 'path';
import yaml from 'yaml';

import { NextJonHandler, AddJobCallback, produceFunc, jobFunc } from '../types';
import { DefaultDeserializer } from 'v8';

export type FileRoot = {
  path: string;
};

export enum DataBaseOrmKind {
  Prisma = 'prisma',
}

export interface ProduceHandler
  extends HandlerMapping<HandlerKind.Entry, produceFunc> {
  forever: boolean;
}

export interface Producers<H extends ProduceHandler> extends FileRoot {
  handlers: H[];
}

export interface JonHandler extends HandlerMapping<HandlerKind.Queue, jobFunc> {
  name: string;
}

export interface Jobs<H extends JonHandler> extends FileRoot {
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
  Entry = 'entry',
  Queue = 'queue',
}

export type HandlerMapping<K extends HandlerKind, F = Function> = {
  kind: K;
  handler: F;
  file: string;
};

const manifest = 'project.yaml';

export class UserProjectConifg {
  appName: string = '';
  rootPath: string = '';
  version: string = '';
  dbSchema?: DbSchema;
  JobHandler: Jobs<JonHandler> | undefined;
  ProcessHandler: Producers<ProduceHandler> | undefined;

  static async parse(app: string): Promise<UserProjectConifg> {
    if (fs.existsSync(app) == false) {
      throw new Error(`can't find user project file ${path}`);
    }

    const fsState = fs.statSync(app);

    if (fsState.isDirectory() == false) {
      throw new Error(`unknow project dir ${app}`);
    }

    let root = path.resolve(app);
    const manifestFile = path.resolve(root, manifest);

    let projectCfg = yaml.parse(fs.readFileSync(manifestFile, 'utf-8'));
    if (projectCfg === undefined) {
      throw new Error(`parse project cfg failed ${projectCfg}`);
    }

    return {
      appName: projectCfg.name,
      rootPath: root,
      version: projectCfg.version,
      dbSchema: await getDbScript(root, projectCfg),
      JobHandler: await jobHandler(root, projectCfg),
      ProcessHandler: await producerHandlerr(root, projectCfg),
    };
  }
}
async function jobHandler(
  root: string,
  content: any,
): Promise<Jobs<JonHandler> | undefined> {
  if (content.JobHandlers === undefined) {
    return undefined;
  }
  let handlers: Jobs<JonHandler> = {
    handlers: [],
    path: root,
  };
  content.JobHandlers.handlers.forEach((e) => {
    let file = path.resolve(root, e.file);
    const h = require(`${file}`);
    handlers.handlers.push({
      file: e.file as string,
      handler: h[e.handler] as jobFunc, // verify function types todo
      name: e.name as string,
      kind: HandlerKind.Queue,
    });
  });

  return handlers;
}

async function producerHandlerr(
  root: string,
  content: any,
): Promise<Producers<ProduceHandler> | undefined> {
  if (content.Producers === undefined) {
    return undefined;
  }
  let handlers: Producers<ProduceHandler> = {
    handlers: [],
    path: root,
  };
  content.Producers.handlers.forEach((e) => {
    let file = path.resolve(root, e.file);
    const h = require(`${file}`);
    handlers.handlers.push({
      file: e.file as string,
      handler: h[e.handler] as produceFunc, // verify function types todo
      forever: (e.forever as boolean) ?? false,
      kind: HandlerKind.Entry,
    });
  });

  return handlers;
}

async function getDbScript(
  root: string,
  content: any,
): Promise<DbSchema | undefined> {
  if (content.dbSchema) {
    return {
      kind: DataBaseOrmKind[content.dbSchema.kind as string],
      schemaFile: path.resolve(root, content.dbSchema.file),
      versionName: content.dbSchema.migrateVersionName as string,
    };
  }

  return undefined;
}
