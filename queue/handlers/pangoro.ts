import { PrismaClient, LcmpMessage } from "@prisma/client";
import { time } from "console";
import { TimestampMock } from "graphql-scalars";
import { JSONObject } from "graphql-scalars/mocks";
import { fetch, sleep } from "../utils";

// 我们框架封装？ 不对用户暴露queue?
import Queue from "bee-queue";

const prisma = new PrismaClient();
// queue的名字?
const queue = new Queue("pangoro-handleSourceChain", {
      redis: {
            host: "47.243.92.91", // redis 连接
            port: 6379,
            password: "4d1ecc8ef3e8290",
            db: 5,
      },
});

export async function demo() {
      console.log("demo");
}
//@函数注解？
// 生产源链消息数据  1 数据库里未完成的关联消息  2 数据库取最新的源链消息，去翻页获取链上后续跨链消息
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

// 处理源链 单个任务数据
// 文件里函数 对应处理的queue
export async function handleSourceChain(data: Record<string, any>) {
      console.log(`crab ${JSON.stringify(data)}`);
      if (!data.laneId || !data.nonce) {
            return;
      }

      // 根据laneid + nonce 去pangolin 上获取数据
      let msg: LcmpMessage | null = await prisma.lcmpMessage.findUnique({
            where: {
                  messageId: _buildMsgId("pangoro", data.laneId, data.nonce),
            },
      });

      if (!msg) {
            let newMsg: LcmpMessage = {
                  messageId: _buildMsgId("pangoro", data.laneId, data.nonce),
                  sourceChain: "pangoro",
                  targetChain: "pangolin",
                  sourceCursor: data.cursor,
                  acceptedHash: data.blockHash,
                  createdAt: new Date(),
                  updateAt: new Date(),
                  acceptedTime: data.timestamp,
                  dispatchHash: "",
                  deliveredHash: "",
                  dispatchResult: "",
                  deliveredResult: "",
                  dipatchTime: "",
                  deliveredTime: "",
            };
            const res = await prisma.lcmpMessage.create({
                  data: newMsg,
            });
      } else {
            //console.log(`accepeted hash  ${msg.acceptedHash}`);
      }

      //  指定下一个任务 dispached 处理
      return {
            nextHandler: {
                  name: "pangolin", // handler 文件名称
                  handler: "handleDispached", // func name
                  // 业务输入多个参数
                  params: {
                        messageId: `${data.laneId}-${data.nonce}`,
                        fromChain: "pangoro",
                  },
            },
      };
}

export async function handleDelivered(input: any) {
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

function _buildMsgId(chain: string, laneId: string, nonce: string) {
      return `${chain}-${laneId}-${nonce}`;
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

// 框架来做？
function _addQeueu(data: Record<string, string>) {
      // 注意queue的名字  是 pangoro-handleSourceChain (文件名-函数名)
      queue.createJob(data).retries(3).timeout(3000).save();
}
