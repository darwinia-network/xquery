import { QueueHandler, fetchGraphqlData } from '@darwinia/xquery-type';
import { crab2darwiniaLcmpMessage } from '@prisma/client';
import { MessageStore } from '../store';

const subQueryEndppint = 'http://192.168.43.174:3002';
const graphqlFiled = 'bridgeCrabDispatch';

// 统一context
export async function handle(data: unknown): Promise<QueueHandler> {
  let store = new MessageStore();

  // 1 队列传过来该条消息data 类型转为crab2darwiniaLcmpMessage
  let msg = data as crab2darwiniaLcmpMessage;

  // 2 根据消息id 去subquery上查Dispatched消息记录
  const queryBody = _buildQuery(msg.messageId);

  let dispachedMsg = await fetchGraphqlData(subQueryEndppint, queryBody, graphqlFiled);

  if (dispachedMsg && dispachedMsg.id) {
    // 3 跟新该消息记录
    console.log(`darwinia dispatched message ${JSON.stringify(dispachedMsg)}`);
    msg.dispatchedTime = dispachedMsg.timestamp;
    msg.messageDispatchedHash = dispachedMsg.blockHash;
    msg.dispatchedResult = dispachedMsg.result;
    await store.updateDispachedMsg(msg);

    // 4 消息放入 Delivered队列
    return {
      queueName: 'crabDelivered',
      data: msg,
    };
  }

  // 5 当未获取到dispachedMsg消息时, 重放入dispatched队列   (可选)
  // if (dispachedMsg === null) {
  //       return {
  //             queueName: "darwiniaDispatched",
  //             data: msg,
  //       };
  // }
}

function _buildQuery(messageId: string): string {
  return `{
            query {
               	bridgeCrabDispatch(id:"${messageId}"){
                            id
                            nonce
                            timestamp
                            blockHash
                            result
                  }   
            }
      }`;
}
