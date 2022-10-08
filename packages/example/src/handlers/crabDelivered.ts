import { QueueHandler, fetchGraphqlData } from "@darwinia/xquery-type/dist";
import { crab2darwiniaLcmpMessage } from "@prisma/client";
import { MessageStore } from "../store";

const subQueryEndppint = "http://192.168.43.174:3001";
const graphqlFiled = "bridgeDarwiniaMessagesDelivered";

export async function handle(data: unknown): Promise<QueueHandler> {
      let store = new MessageStore();

      let msg = data as crab2darwiniaLcmpMessage;

      // 1 构建subquery查询body
      const queryBody = _buildQuery(msg.messageId);
      // 2 访问subquery查询delivered消息
      let deliveredMsg = await fetchGraphqlData(
            subQueryEndppint,
            queryBody,
            graphqlFiled
      );
      if (deliveredMsg && deliveredMsg.id) {
            // 3 跟新该消息记录
            console.log(
                  `crab delivered message ${JSON.stringify(deliveredMsg)}`
            );
            msg.deliveredTime = deliveredMsg.timestamp;
            msg.messageDeliveredHash = deliveredMsg.blockHash;
            msg.deliveredResult = deliveredMsg.dispatchResults;
            await store.updateDeliveredMsg(msg);

            // 4 lcmp 消息跨链关联结束
            return;
      }

      // 5 当未获取到deliveredMsg消息时, 重放入deliveredMsg队列, 轮询查询   (可选)
      if (deliveredMsg === null) {
            return {
                  queueName: "crabDelivered",
                  data: msg,
            };
      }
}

function _buildQuery(messageId: string): string {
      return `{
            query {
               	bridgeDarwiniaMessagesDelivered(id:"${messageId}"){
                            id,
                            nonce,
                            blockHash,
                            timestamp,
                            dispatchResults
                        } 
                  }
      }`;
}
