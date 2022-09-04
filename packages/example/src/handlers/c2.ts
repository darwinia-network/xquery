import { NextJonHandler } from '../../../node/src/types';

export async function handle(data: any): Promise<NextJonHandler> {
  console.log('c2 queue');
  console.log('end');
  return;
}
