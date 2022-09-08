import { AddJobCallback } from '../../../node/src/types';
import { PrismaClient, A2CMessage } from '@prisma/client';
/*
  Trace  and record  LCMP cross-chain message from pangoro to pangolin

*/
export async function handle(done: AddJobCallback) {
  console.log('pangoro accepted message');

  // 1 find cross-chain message on pangoro

  /* 2 record message into database
   const p = new PrismaClient();
   await p.a2CMessage.create({
     data: {
       messageId: 'id',
     },
   });
  */
  // 3 put cross-chain message into pangolinDispached queue

  done('pangolinDispached', { data: { messageId: 'id', hash: 'hash' } });
}
