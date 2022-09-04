import { NextJonHandler } from '../../../node/src/types';
import { PrismaClient, A2CMessage } from '@prisma/client';

const prisma = new PrismaClient();

export async function handle(data: any): Promise<NextJonHandler> {
  console.log('c queue');

  let t = await prisma.a2CMessage.findUnique({
    where: {
      messageId: '1212',
    },
  });
  if (t) {
    t.deliveredHash = 'ddddfgg';
    t.deliveredTime = new Date().toString();
    await prisma.a2CMessage.update({
      where: {
        messageId: t.messageId,
      },
      data: {
        deliveredHash: t.deliveredHash,
        deliveredTime: t.deliveredTime,
      },
    });
  }

  return;
}
