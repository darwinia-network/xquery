import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const DEFAULT_PORT = 8001;

async function bootstrap() {
  const validate = (x: any) => {
    const p = parseInt(x);
    return isNaN(p) ? null : p;
  };

  //const port = validate(argv.port) ?? DEFAULT_PORT;

  try {
    const app = await NestFactory.create(AppModule);
    await app.init();

    await app.listen(DEFAULT_PORT);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

bootstrap();
