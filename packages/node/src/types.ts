import { Queue } from 'bull';
export type AddJobCallback = (handleJobName?: string | undefined, data?: any) => void;
export type bullQueue = (name: string) => Queue;

export type NextJonHandler =
  | {
      name: string;
      data: unknown;
    }
  | undefined;

export type produceFunc = (done: AddJobCallback) => void;

export type jobFunc = (data: unknown) => Promise<NextJonHandler>;

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
