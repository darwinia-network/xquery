import { NextJonHandler } from '../../../node/src/types';

export async function handle(data: any): Promise<NextJonHandler> {
  console.log('process data from c queue');
  console.log('ending');
  return;
}
