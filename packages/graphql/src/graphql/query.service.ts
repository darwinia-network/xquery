import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { SchemaBuilderService } from './schemaBuilder.service';
import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';

import { ApolloServer } from 'apollo-server-express';

import { yargsOption } from '../yargs';

@Injectable()
export class QueryService implements OnModuleInit {
  private readonly logger = new Logger(QueryService.name);
  private apolloServer: ApolloServer | undefined;
  constructor(
    public SchemaBuilerService: SchemaBuilderService,
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}

  async onModuleInit() {
    try {
      if (!this.httpAdapterHost) {
        return;
      }
      this.apolloServer = await this.createAppolo();
      const app = this.httpAdapterHost.httpAdapter.getInstance();
      await this.apolloServer.start();
      this.apolloServer.applyMiddleware({
        app,
        path: '/',
        cors: true,
      });
    } catch (error) {
      throw new Error(`create apollo server failed, ${(error as Error).message}`);
    }
  }

  private async createAppolo() {
    const apolloServerPlugins = [
      ApolloServerPluginCacheControl({
        defaultMaxAge: 5,
        calculateHttpHeaders: true,
      }),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ];

    const appoloContext = await this.SchemaBuilerService.buildApollo(yargsOption.schema);
    appoloContext.plugins = apolloServerPlugins;
    return new ApolloServer(appoloContext);
  }
}
