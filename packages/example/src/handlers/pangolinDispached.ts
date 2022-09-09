import { MessageDemo } from '../utils';
import { PrismaClient, A2CMessage } from '@prisma/client';
import { QueueHandler } from '../../../node/src/types';

/**
 *
 */

const prisma = new PrismaClient();

export async function handle(data: any): Promise<QueueHandler> {
  //
  // let msg = new MessageDemo(data);
  // await msg.save();

  // 1 find related cross-chain message on pangolin according to pangoro data

  /* 2 update record in database
    let t = await prisma.a2CMessage.findUnique({
      where: {
        messageId: data.messageId,
     },
   });

    if (t === null) {
      await prisma.a2CMessage.create({
        data: {
           authorId: 10,
           messageId: data.messageId,
           dispachedHash: 'hash',
        },
      });
   }
  */

  // 3 put pangolin dispached messsage into pangoroDelivered queue
  return {
    queueName: 'pangoroDelivered',
    data: {
      messageId: data.messageId,
    },
  };
}
