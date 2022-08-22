import { PrismaClient } from "@prisma/client";
import { fetch, sleep } from "./utils";
import Queue from "bee-queue";

let prisma = new PrismaClient();

export async function sourcMessage() {
      let soureCursor = "";
      let sycMessageIds = await prisma.lcmpMessage.findMany({
            where: {
                  OR: [
                        {
                              dispatchResult: {
                                    equals: "",
                              },
                        },
                        {
                              deliveredResult: {
                                    equals: "",
                              },
                        },
                  ],
                  AND: {
                        sourceChain: {
                              equals: "pangoro",
                        },
                  },
            },
            select: {
                  messageId: true,
            },
      });
      if (sycMessageIds.length > 0) {
            // 数据库未完成的关联记录
            // 放入队列？
      }
      // 链上（subquery）获取最新的messageId
      while (true) {
            let cursor = await prisma.lcmpMessage.findFirst({
                  where: {
                        sourceChain: {
                              equals: "pangoro",
                        },
                  },
                  orderBy: {
                        createdAt: "desc",
                  },
                  select: {
                        sourceCursor: true,
                  },
            });
            if (cursor) {
                  soureCursor = cursor.sourceCursor;
            }

            // 测试的数据
            // soureCursor =
            //       "WyJwcmltYXJ5X2tleV9hc2MiLFsiMHg3MjZmNmM2OS0xNDkiXV0=";
            let data = await fetch(
                  process.env.PANGORO_SUBQL,
                  _buildAcceptedQuery(2, soureCursor),
                  "bridgePangolinMessageAccepteds"
            );

            if (!data) {
                  continue;
            }
            if (data.edges.length > 0) {
                  soureCursor = data.edges[data.edges.length - 1].cursor;
            } else {
                  soureCursor = "";
            }

            sleep(10000);
            // 放入队列 由框架来做？
            var count = 0;
            data.nodes.forEach((element: Record<string, any>) => {
                  element["cursor"] = data.edges[count].cursor;
                  count++;
                  _addQeueu(element);
            });
      }
}

function _buildAcceptedQuery(count: number, after: string | undefined): string {
      let cursor = "";
      if (after) {
            cursor = `after:"${after}",`;
      }

      return `{
           query {
               bridgePangolinMessageAccepteds(first:${count}, ${cursor}){

               nodes {
                    laneId
                    nonce
                    blockHash
                    timestamp
                }
                edges {
                    cursor
                }

               }
           }

      }`;
}

// 用文件命名的 入队列名字
const queue = new Queue("pangoroAccepted", {
      redis: {
            host: "47.243.92.91", // redis 连接
            port: 6379,
            password: "4d1ecc8ef3e8290",
            db: 5,
      },
});

function _addQeueu(data: Record<string, string>) {
      // 注意queue的名字
      queue.createJob(data).retries(3).timeout(3000).save();
}
