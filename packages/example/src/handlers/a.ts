import { MessageDemo } from '../outer';

/**
 * 框架入口处理 用户指定，类型参数不确定？
 * return nextHandler 类型的固定
 * @param data
 */
import { NextJonHandler } from '../../../node/src/types';
const outer = {
  name: 'start',
  age: 999,
};
export async function handle(data: any): Promise<NextJonHandler> {
  console.log('process data from a queue');

  let msg = new MessageDemo(data);
  await msg.save();

  console.log('outer age ', outer);

  return {
    name: 'b', // push message to queue b
    // data
    data: {
      messageId: 'htrhj',
    },
  };
}
