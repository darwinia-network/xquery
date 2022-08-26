import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

const DEFAULT_PORT = 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  const port = process.env.PORT ?? DEFAULT_PORT;

  await app.listen(port);
}

bootstrap();
