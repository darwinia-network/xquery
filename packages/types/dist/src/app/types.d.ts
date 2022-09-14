import { Queue } from 'bull';
export declare type FileRoot = {
    path: string;
};
export declare enum DataBaseOrmKind {
    Prisma = "prisma"
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
export declare type PrismaOrm = DbOrmMap<DataBaseOrmKind.Prisma>;
export declare type DbSchema = PrismaOrm | undefined;
export declare enum HandlerKind {
    DataSource = "dataSource",
    Queue = "queue"
}
export declare type HandlerMapping<K extends HandlerKind, F = Function> = {
    kind: K;
    handler: F;
    file: string;
};
export declare type IntoQueueCallback = (queueName?: string | undefined, data?: unknown) => void;
export declare type BullQueue = (name: string) => Queue;
export declare type QueueHandler = {
    queueName: string;
    data: unknown;
} | undefined;
export declare type DataSourceFunc = (done: IntoQueueCallback) => void;
export declare type QueueJobFunc = (data: unknown) => Promise<QueueHandler>;
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
export {};
