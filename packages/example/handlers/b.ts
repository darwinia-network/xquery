/**
 *
 * @param data
 */
export async function handle(data: any): Promise<unknown> {
  console.log('process data from b queue');

  return {
    nextHandler: {
      name: 'c', // push message to queue c
      // data
      params: {
        messageId: data.messageId,
      },
    },
  };
}
