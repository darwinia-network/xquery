import { NextJonHandler } from '../../../node/src/types';

export async function handle(data: any): Promise<NextJonHandler> {
  console.log('handle crab parachain data from kusama queue');

  // 1 find  related message on kusama  according to crab parachain data
  // 2 update record in database
  // 3 put kusama messsage into karura queue
  return {
    name: 'karura',
    data: {
      messageId: 'id',
      kusamaHash: 'hash',
    },
  };
}
