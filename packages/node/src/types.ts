import { Queue } from 'bull';
export type AddJobCallback = (queue?: string | null, data?: any) => void;
export type bullQueue = (name: string) => Queue;
