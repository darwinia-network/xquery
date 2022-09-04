import { MessageDemo } from '../outer';
import { PrismaClient, A2CMessage } from '@prisma/client';
import { NextJonHandler } from '../../../node/src/types';
/**
 *
 *
 * @param data
 */

const prisma = new PrismaClient();

export async function handle(data: any): Promise<NextJonHandler> {
  let msg = new MessageDemo(data);
  await msg.save();
  console.log('a queue');

  let t = await prisma.a2CMessage.findUnique({
    where: {
      messageId: '1212',
    },
  });

  if (t === null) {
    await prisma.a2CMessage.create({
      data: {
        authorId: 10,
        messageId: '1212',
        deliveredHash: 'hrthytjtyj',
      },
    });
  }
  return {
    name: 'b', // push message to queue b
    // data
    data: {
      messageId: 'htrhj',
    },
  };
}
