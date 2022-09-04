import { NextJonHandler } from '../../../node/src/types';

export async function handle(data: any): Promise<NextJonHandler> {
  console.log('c1 queue');
  return {
    name: 'c2', // push message to queue c2
    // data
    data: {
      messageId: 'htrhj',
    },
  };
}
