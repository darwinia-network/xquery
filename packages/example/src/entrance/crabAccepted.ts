import { IntoQueueCallback, sleep, fetchGraphqlData } from '@darwinia/xquery-type';

import { PrismaClient } from '@prisma/client';
import { MessageStore } from '../store';

const subQueryEndppint = 'http://192.168.43.174:3001';
const graphqlFiled = 'bridgeDarwiniaMessagesAccepteds';

const prisma = new PrismaClient();

//note  组件间隔一直执行该handler函数
export async function handle(done: IntoQueueCallback) {
  let store = new MessageStore();

  //1 检查本地数据库里没有dispached记录的消息
  let needSyncDispachedMsgs = await prisma.crab2darwiniaLcmpMessage.findMany({
    where: {
      messageDispatchedHash: {
        equals: '',
      },
    },
  });
  if (needSyncDispachedMsgs && needSyncDispachedMsgs.length > 0) {
    needSyncDispachedMsgs.forEach((accepetedMsg) => {
      // 2 把每条跨链消息放入Dispatched队列
      console.log(`need to sync accepted messages from database ${JSON.stringify(accepetedMsg)}`);

      done('darwiniaDispatched', accepetedMsg);
    });
  }

  // 3 根据数据库记录最新accepted消息，去取获取crab链上后续的accepted消息
  let lastAcceptedMsg = await prisma.crab2darwiniaLcmpMessage.findFirst({
    orderBy: {
      messageId: 'desc',
    },
  });

  let queryBody = _buildQuery(10, lastAcceptedMsg?.acceptedTime ?? '2008-01-01T00:00:00.000');
  // xquery  去 同步subquery上的数据

  let newSyncMsgs = await fetchGraphqlData(subQueryEndppint, queryBody, graphqlFiled);

  if (newSyncMsgs && newSyncMsgs.nodes && newSyncMsgs.nodes.length > 0) {
    console.log(`need to sync accepted message from on clain  ${JSON.stringify(newSyncMsgs)}`);
    // 4  新的accepted 消息记录到数据库

    newSyncMsgs.nodes.forEach(async (msg: any) => {
      let sourceMsg = {
        messageId: msg.id,
        soureChain: 'crab',
        targetChain: 'darwinia',
        messageAcceptedHash: msg.blockHash,
        messageDeliveredHash: '',
        messageDispatchedHash: '',
        acceptedTime: msg.timestamp,
        deliveredTime: '',
        dispatchedTime: '',
      };
      // prisma
      await store.save(sourceMsg);
    });
  }
}

function _buildQuery(pageSize: number, messageDate: string): string {
  return `{
            query {
               	bridgeDarwiniaMessagesAccepteds(first:${pageSize}, filter:{timestamp:{greaterThan:"${messageDate}"}}){
                             nodes{
                              id,
                              nonce,
                              blockHash,
                              timestamp,
      
                           }
                        } 
                  }
            }`;
}
