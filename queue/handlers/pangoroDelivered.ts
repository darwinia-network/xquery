import { PrismaClient, LcmpMessage } from "@prisma/client";
import { fetch, sleep } from "../utils";

export async function handle(input: any) {
      console.log(`handle delivered ${JSON.stringify(input)}`);

      if (input.messageId === undefined) {
            return;
      }

      let start = new Date();
      start.setHours(start.getHours() + 2);
      while (new Date() < start) {
            sleep(5000);
            let data = await fetch(
                  process.env.PANGORO_SUBQL,
                  _buildDeleiveredQuery(input.messageId),
                  "bridgePangolinMessageDelivered"
            );
            if (data === null) {
                  // 可能数据还没有
                  continue;
            }

            // 查询失败
            if (data.id === undefined) {
                  // console.log(data);
            } else {
                  // 记录数据库
                  console.log(`delivered data ${JSON.stringify(data)}`);
                  let pclient = new PrismaClient();
                  let update = await pclient.lcmpMessage.update({
                        where: {
                              messageId: "pangoro" + "-" + input.messageId,
                        },
                        data: {
                              deliveredHash: data.blockHash,
                              deliveredResult: data.dispatchResults,
                              updateAt: new Date(),
                              deliveredTime: data.timestamp,
                        },
                  });
                  //console.log(update);
            }

            return;
      }
}

function _buildDeleiveredQuery(messageId: string): string {
      return `{
           query {
               bridgePangolinMessageDelivered(id:"${messageId}"){
                    nonce
                    laneId
                    id
                    timestamp
                    blockHash
                    dispatchResults
               }
           }
      }`;
}
