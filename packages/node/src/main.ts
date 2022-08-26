import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueueService } from './queue/queue.service';
import { ArenaService } from '/monitor/arena.service';
import { getLogger, NestLogger } from './utils/logger';
import { getYargsOption } from './args';

const DEFAULT_PORT = 3000;
const logger = getLogger('subql-node');
const { argv } = getYargsOption();

async function bootstrap() {
  const validate = (x: any) => {
    const p = parseInt(x);
    return isNaN(p) ? null : p;
  };

  const port = validate(argv.port) ?? DEFAULT_PORT;

  try {
    const app = await NestFactory.create(AppModule, {
      logger: new NestLogger(),
    });
    // 设计模式 和 工程
    //
    const queueService = app.get(QueueBakend); // 没有api

    const monitorService = app.get(ArenaService); // api 从queue 读取job数据
    //
    //
    // 命名
    // 读取业务yaml 配置
    await queueService.init();

    await monitorService.init();

    await app.listen(port);
    logger.info(`Node start on port: ${port}`);
  } catch (e) {
    logger.error(e, 'Node failed to start');
    process.exit(1);
  }
}

bootstrap();
