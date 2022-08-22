import { PrismaClient, LcmpMessage } from "@prisma/client";
import { fetch, sleep } from "../utils";

// pangolin 跨链消息源数据生成
export async function sourcMessage() {}

export async function handle(input: Record<string, any>) {
      console.log(`pangolin receive ${JSON.stringify(input)}`);
      if (input.messageId === undefined) {
            return;
      }

      let start = new Date();
      start.setHours(start.getHours() + 2);
      while (new Date() < start) {
            sleep(2000);
            let data = await fetch(
                  process.env.PANGOLIN_SUBQL,
                  _builDsipachedQuery(input.messageId),
                  "bridgePangoroDispatch"
            );

            if (data && data.id) {
                  // 更新数据库
                  let pclient = new PrismaClient();
                  let up = await pclient.lcmpMessage.update({
                        where: {
                              messageId: "pangoro" + "-" + input.messageId, // pangoro 前缀 表示消息发送源链
                        },
                        data: {
                              dispatchHash: data.blockHash,
                              dispatchResult: data.result,
                              updateAt: new Date(),
                              dipatchTime: data.timestamp,
                        },
                  });

                  // 传递下一个任务 delivered
                  return {
                        nextHandler: {
                              name: "pangoroDelivered", // handler 文件名称
                              handler: "handle", // func name
                              // 业务输入参数个数可变
                              params: {
                                    messageId: input.messageId,
                                    fromChain: "pongolin",
                              },
                        },
                  };
            }
      }
}

function _builDsipachedQuery(messageId: string): string {
      return `{
            query {
                bridgePangoroDispatch(id: "${messageId}"){
                    id
                    nonce
                    timestamp
                    blockHash
                    result
                }
            }
    }`;
}
