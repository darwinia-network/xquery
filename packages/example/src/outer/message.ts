export class MessageDemo {
  private data: unknown;
  constructor(data: unknown) {
    this.data = data;
  }

  get index() {
    return this.data;
  }

  public async save(): Promise<void> {
    //logger.info('start save');
    console.log('start save');
    await this.handleLcmpMsg();
  }
  private async handleLcmpMsg() {
    // 数据库操作
    // 业务逻辑

    // logger 来自global的实例
    //logger.info('---->  customer handlerMsg');
    console.log('customer handler Msg', this.data);
  }
}
