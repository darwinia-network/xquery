import { IntoQueueCallback } from '../../../node/src/types';

/*
 Trace  and record  XCMP cross-chain message from crab parachain to karura
*/
export async function handle(done: IntoQueueCallback) {
  console.log('crab parachain');

  // 1 find cross-chain message on crab parachain
  // 2 record message into database
  // 3 put cross-chain message into kusama queue

  done('kusama', { messsage: { id: 'id', crabHash: 'hash' } });
}
