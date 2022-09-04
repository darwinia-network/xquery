import { AddJobCallback } from '../../../node/src/types';

export async function handle(done: AddJobCallback) {
  console.log('this is c2c message');

  done('c1', { c1: 12 });
}
