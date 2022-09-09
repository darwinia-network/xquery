export class MessageDemo {
  private data: unknown;
  constructor(data: unknown) {
    this.data = data;
  }

  get index() {
    return this.data;
  }

  public async save(): Promise<void> {
    await this.handleLcmpMsg();
  }
  private async handleLcmpMsg() {
    console.log('customer  data', this.data);
  }
}
