import { QueueHandler } from '@darwinia/xquery-type';

export async function handle(data: any): Promise<QueueHandler> {
  console.log('handle kusama data from karura queue');

  // find related cross-chain message on karura according to kusama data
  // update record in database

  // end of recording the XCMP cross-chain messages
  return;
}
