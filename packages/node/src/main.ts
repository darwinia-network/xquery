import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { yargsOption } from './yargs';

async function bootstrap() {
  try {
    // update databse_url with schema arg todo
    const app = await NestFactory.create(AppModule);
    await app.init();
    const port = process.env.PORT ?? yargsOption.port;
    await app.listen(port);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

bootstrap();
