/**
 *
 * @param data
 */

import { NextJonHandler } from '../../../node/src/types';

export async function handle(data: any): Promise<NextJonHandler> {
  console.log('process data from b queue');

  return {
    name: 'c', // push message to queue b
    // data
    data: {
      messageId: 'htrhj',
    },
  };
}
