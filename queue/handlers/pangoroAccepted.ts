import { PrismaClient, LcmpMessage } from "@prisma/client";
import { time } from "console";
import { TimestampMock } from "graphql-scalars";
import { JSONObject } from "graphql-scalars/mocks";
import { fetch, sleep } from "../utils";

const prisma = new PrismaClient();

export async function demo() {
      console.log("demo");
}

// 处理源链 单个任务数据
// 文件里函数 对应处理的queue
export async function handle(data: Record<string, any>) {
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
                  name: "pangolinDispached", // handler 文件名称
                  handler: "handle", // func name
                  // 业务输入多个参数
                  params: {
                        messageId: `${data.laneId}-${data.nonce}`,
                        fromChain: "pangoro",
                  },
            },
      };
}

function _buildMsgId(chain: string, laneId: string, nonce: string) {
      return `${chain}-${laneId}-${nonce}`;
}

// 框架来做？
// function _addQeueu(data: Record<string, string>) {
//       // 注意queue的名字  是 pangoro-handleSourceChain (文件名-函数名)
//       queue.createJob(data).retries(3).timeout(3000).save();
// }
