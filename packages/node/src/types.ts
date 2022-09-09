import { Queue } from 'bull';
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
