import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { graphqlModule } from './graphql/query.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      isGlobal: true,
    }),
    DatabaseModule,
    graphqlModule,
  ],
})
export class AppModule {}
