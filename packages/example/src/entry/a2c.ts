/**
 * source chain produce cross chain message
 */

// todo 这里函数类型需要指定
import { AddJobCallback } from '../../../node/src/types';
export async function handle(done: AddJobCallback) {
  console.log('this is handler message');

  // The callback function could push data in queue 'a' it's the file name in handlers
  done('a', { x: 12 });
}
