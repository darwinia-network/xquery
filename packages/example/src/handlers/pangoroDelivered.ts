/**
 *
 * @param data
 */

import { NextJonHandler } from '../../../node/src/types';

export async function handle(data: any): Promise<NextJonHandler> {
  console.log('handle pangolinDispached data from pangoroDelivered queue');

  // 1 find related cross-chain message on pangolin according to pangolin dispached data
  // 2 update record in database
  // 3 end of recording the LCMP cross-chain messages
  return;
}