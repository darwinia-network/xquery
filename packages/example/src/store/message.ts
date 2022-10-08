import { PrismaClient, crab2darwiniaLcmpMessage, Prisma } from '@prisma/client';

const pclient = new PrismaClient();

export class MessageStore {
  constructor() {}

  public async save(data: Prisma.crab2darwiniaLcmpMessageCreateInput): Promise<void> {
    try {
      const msg = await pclient.crab2darwiniaLcmpMessage.findUnique({
        where: {
          messageId: data.messageId,
        },
      });
      if (msg != null) {
        return;
      }

      await pclient.crab2darwiniaLcmpMessage.create({
        data: data,
      });
    } catch (error) {
      console.error(error);
    }
  }

  public async updateDispachedMsg(data: crab2darwiniaLcmpMessage): Promise<void> {
    try {
      await pclient.crab2darwiniaLcmpMessage.update({
        where: {
          messageId: data.messageId,
        },
        data: {
          dispatchedTime: data.dispatchedTime,
          messageDispatchedHash: data.messageDispatchedHash,
          dispatchedResult: data.dispatchedResult,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  public async updateDeliveredMsg(data: crab2darwiniaLcmpMessage): Promise<void> {
    try {
      await pclient.crab2darwiniaLcmpMessage.update({
        where: {
          messageId: data.messageId,
        },
        data: {
          deliveredTime: data.deliveredTime,
          messageDeliveredHash: data.messageDeliveredHash,
          deliveredResult: data.deliveredResult,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
