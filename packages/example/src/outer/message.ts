export class MessageDemo {
  private data: unknown;
  constructor(data: unknown) {
    this.data = data;
  }

  get index() {
    return this.data;
  }

  public async save(): Promise<void> {
    console.log('start save');
    await this.handleLcmpMsg();
  }
  private async handleLcmpMsg() {
    console.log('customer  Msg', this.data);
  }
}
