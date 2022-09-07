import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { yargsOption } from './yargs';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  try {
    //todo: update databse_url with schema arg
    const app = await NestFactory.create(AppModule);
    await app.init();

    app.useLogger(app.get(Logger));
    const port = process.env.PORT ?? yargsOption.port;

    await app.listen(port);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

bootstrap();
