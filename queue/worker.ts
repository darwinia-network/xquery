import { sleep, mkdir, writeFile } from "../utils";
import Queue from "bee-queue";

// const save = (filename, dirname, content) => {
//     const path = `./data/${dirname}`
//     mkdir(path)
//     writeFile(`${path}/${filename}.json`, content)
// }

const addJob = (queueName: string, params: any) => {
      const queue = new Queue(queueName, {
            redis: {
                  host: "47.243.92.91", // redis 连接
                  port: 6379,
                  password: "4d1ecc8ef3e8290",
                  db: 5,
            },
      });
      const job = queue.createJob(params);
      job.timeout(3000).retries(2).save(); // 参数从配置文件读取
};

// const next = async (currentHandlerName: string, nextHandler: any) => {
//       if (nextHandler.name) {
//             if (nextHandler.name == currentHandlerName) {
//                   await sleep(2000);
//             }

//             addJob(nextHandler.name, nextHandler.params);
//       }
// };

const handle = async (handlerName: string, handler: any, params: any) => {
      const result = await handler[handlerName](params);
      //const messageKey = result?.messageKey || params?.messageKey;

      // 必须需要的吗？
      //   if (!messageKey) {
      //         throw new Error(
      //               `Missing 'messageKey' in params or result of handler '${handlerName}'.`
      //         );
      //   }

      //
      let nextHandler = undefined;
      if (result?.nextHandler && result?.nextHandler?.name) {
            nextHandler = {
                  name: result.nextHandler.name,
                  params: result.nextHandler.params || {},
                  handler: result.nextHandler.handler || undefined,
            };
            // nextHandler.params.messageKey = messageKey;
      }

      return nextHandler;
};

export const start = async (
      handlerFileName: string,
      funcName: string,
      handler: any
) => {
      let queueName = handlerFileName + "-" + funcName;
      new Queue(queueName, {
            redis: {
                  host: "47.243.92.91", // redis 连接
                  port: 6379,
                  password: "4d1ecc8ef3e8290",
                  db: 5,
            },
      }).process(10, async (job) => {
            // 10 可以一次处理10个job

            try {
                  const nextJob = await handle(funcName, handler, job.data);

                  if (nextJob === undefined) {
                        return;
                  }
                  // 相同的处理handler
                  if (
                        nextJob.name === handlerFileName &&
                        nextJob.handler === funcName
                  ) {
                        console.log("must not be self");
                        return;
                  }
                  console.log(nextJob);
                  // 根据nextJob 入队列  如果传入的name 和 handler。  如果传入的队列名字不存在，但是任然会创建队列，没有对应的process，怎么处理 ？  TODO
                  addJob(nextJob.name + "-" + nextJob.handler, nextJob.params);
            } catch (err) {
                  console.error(err);
            }

            return { ok: true };
      });
      console.log(`${handlerFileName}-${funcName} worker is running`);
};
