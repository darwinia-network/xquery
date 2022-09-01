import { Queue } from 'bull';
export type AddJobCallback = (
  handleJobName?: string | undefined,
  data?: any,
) => void;
export type bullQueue = (name: string) => Queue;

export type NextJonHandler =
  | {
      name: string;
      data: unknown;
    }
  | undefined;

export type produceFunc = (done: AddJobCallback) => void;

export type jobFunc = (data: unknown) => Promise<NextJonHandler>;
