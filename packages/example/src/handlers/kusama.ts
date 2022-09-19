import { QueueHandler } from '@darwinia/xquery-type';

export async function handle(data: any): Promise<QueueHandler> {
  console.log('handle crab parachain data from kusama queue');

  // 1 find  related message on kusama  according to crab parachain data
  // 2 update record in database
  // 3 put kusama messsage into karura queue
  return {
    queueName: 'karura',
    data: {
      messageId: 'id',
      kusamaHash: 'hash',
    },
  };
}
