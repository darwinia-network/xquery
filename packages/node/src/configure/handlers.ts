import fs from 'fs';
import util from 'util';
import path from 'path';
// entry handle p
export enum HandlerKind {
  Entry = 'entry',
  Queue = 'queue',
}

export type NodehandlerMap<K extends HandlerKind, F = Function> = {
  kind: K;
  handler: F;
  file: string;
};

export let queueName: string[] = [];

export class Handlers {
  entryCfg: NodehandlerMap<HandlerKind.Entry>[] = [];
  handlerCfg: NodehandlerMap<HandlerKind.Queue>[] = [];

  static async config(filepath: string): Promise<Handlers> {
    // use VM2  todo
    let entryCfg: NodehandlerMap<HandlerKind.Entry>[] = [];
    let handlerCfg: NodehandlerMap<HandlerKind.Queue>[] = [];
    // note the handlers is a fixed dir
    var normalizedPath = path.join(filepath, 'handlers');
    fs.readdirSync(normalizedPath).forEach(async function (file: string) {
      const handlers = require(`${normalizedPath}/` + file);

      const handlerFileName = file.split('.')[0];
      queueName.push(handlerFileName);
      handlerCfg.push({
        kind: HandlerKind.Queue,
        handler: handlers.handle,
        file: handlerFileName,
      });
    });

    //  note the entry is a fixed dir
    var normalizedPath = path.join(filepath, 'entry');
    fs.readdirSync(normalizedPath).forEach(async function (file: string) {
      const handlers = require(`${normalizedPath}/` + file);
      const handlerFileName = file.split('.')[0];
      entryCfg.push({
        kind: HandlerKind.Entry,
        handler: handlers.asource,
        file: handlerFileName,
      });
    });

    return {
      entryCfg: entryCfg,
      handlerCfg: handlerCfg,
    };
  }
}
