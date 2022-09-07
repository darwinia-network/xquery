/**
 *
 * @param data
 */

import { NextJonHandler } from '../../../node/src/types';

export async function handle(data: any): Promise<NextJonHandler> {
  console.log('b queue');

  // 处理

  // 用户规定next
  return {
    name: 'c', // push message to queue b
    // data
    data: {
      messageId: 'htrhj',
    },
  };
}
