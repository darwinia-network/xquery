import { AddJobCallback } from '../../../node/src/types';
export async function handle(done: AddJobCallback) {
  console.log('this is handler message');

  done('a', { x: 12 });
}
