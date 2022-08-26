import { sleep, mkdir, writeFile } from '../utils';
import Queue from 'bee-queue';

export let localHandeNameSet = new Set<string>('');

/* 关于错误处理 

**/
const addJob = (queueName: string, params: any) => {
  const queue = new Queue(queueName, {
    redis: {
      host: '47.243.92.91', // redis 连接
      port: 6379,
      password: '4d1ecc8ef3e8290',
      db: 5,
    },
  });
  const job = queue.createJob(params);
  job.timeout(3000).retries(2).save(); // 参数从配置文件读取
};

// any 不安全类型
// 异常的安全

const handle = async (handler: any, params: any) => {
  //const result = await handler[handlerName](params);
  let result: unknown;
  try {
    result = await handler.handle(params);
  } catch (error) {}

  // 处理需要业务代码实现 type-safe-error，框架是否要处理业务错误， 以及识别不同错误类型？

  result.map((okData) => {}).mapErr((err) => {});

  let nextHandler = undefined;
  if (result?.nextHandler && result?.nextHandler?.name) {
    nextHandler = {
      name: result.nextHandler.name,
      params: result.nextHandler.params || {},
      handler: result.nextHandler.handler || undefined,
    };
  }

  return nextHandler;
};

export const start = async (
  handlerFileName: string,
  handler: any,
  funcName: string = 'handle',
) => {
  // 默认是文件名称
  let queueName = handlerFileName;
  new Queue(queueName, {
    redis: {
      host: '47.243.92.91', // redis 连接
      port: 6379,
      password: '4d1ecc8ef3e8290',
      db: 5,
    },
  }).process(10, async (job) => {
    // 10 可以一次处理10个job

    try {
      const nextJob = await handle(handler, job.data);

      if (nextJob === undefined) {
        return;
      }

      // 相同的处理handler
      if (nextJob.name === handlerFileName && nextJob.handler === funcName) {
        console.log('must not be self');
        return;
      }

      if (!localHandeNameSet.has(nextJob.name)) {
        throw new Error(`handlerfile  ${nextJob.name} not exist`);
      }
      addJob(nextJob.name, nextJob.params);
    } catch (err) {
      console.error(err);
    }

    return { ok: true };
  });
  console.log(`${handlerFileName} handler is running`);
};
