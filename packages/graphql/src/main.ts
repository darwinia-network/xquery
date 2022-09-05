import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { yargsOption } from './yargs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  const port = process.env.PORT ?? yargsOption.port;

  await app.listen(port);
}

bootstrap();
