/**
 *
 * @param data
 */
export async function handle(data: any): Promise<unknown> {
  console.log('process data from a queue');

  return {
    nextHandler: {
      name: 'b', // push message to queue b
      // data
      params: {
        messageId: 'htrhj',
      },
    },
  };
}
