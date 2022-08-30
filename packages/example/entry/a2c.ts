/**
 * source chain produce cross chain message
 */
import { AddJobCallback } from '../../node/src/types';
export async function asource(done: AddJobCallback) {
  console.log('this is asource message');

  // The callback function could push data in queue 'a' it's the file name in handlers
  done('a', { x: 12 });
}
