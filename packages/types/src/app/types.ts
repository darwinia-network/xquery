// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Queue } from 'bull';

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

export interface QueueProcess<H extends JonHandler> extends FileRoot {
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

/* eslint-disable-next-line @typescript-eslint/ban-types */
export type HandlerMapping<K extends HandlerKind, F = Function> = {
  kind: K;
  handler: F;
  file: string;
};

export type IntoQueueCallback = (queueName?: string | undefined, data?: unknown) => void;
export type BullQueue = (name: string) => Queue;

export type QueueHandler =
  | {
      queueName: string;
      data: unknown;
    }
  | undefined;

export type DataSourceFunc = (done: IntoQueueCallback) => void;

export type QueueJobFunc = (data: unknown) => Promise<QueueHandler>;

interface QueueOptions {
  name: string;
  hostId?: string;
  type?: 'bull' | 'bee';
  prefix?: 'bull' | 'bq' | string;
}

interface RedisConnectionOptions {
  host: string;
  port?: number;
  password?: string;
  db?: string;
}

interface MiddlewareListenOptions {
  port?: number;
  host?: string;
  basePath?: string;
  disableListen?: boolean;
  useCdn?: boolean;
}

export interface ArenaOptions {
  queues: Array<QueueOptions & RedisConnectionOptions>;
  listenOptions: MiddlewareListenOptions;
}
