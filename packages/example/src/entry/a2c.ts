import { AddJobCallback } from '../../../node/src/types';
export async function handle(done: AddJobCallback) {
  console.log('this is handler message');
  // 获取源链上跨链消息， 需要去跟踪的
  // 本地存些源链数据，还未完成跟踪的跨链

  // 文档知道用户
  // 名字下一个处理的队列， data job的data
  // a->b-C

  //
  done('b', { x: 12 });
}
