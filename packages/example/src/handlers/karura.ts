import { NextJonHandler } from '../../../node/src/types';

export async function handle(data: any): Promise<NextJonHandler> {
  console.log('handle kusama data from karura queue');

  // find related cross-chain message on karura according to kusama data
  // update record in database

  // end of recording the XCMP cross-chain messages
  return;
}
