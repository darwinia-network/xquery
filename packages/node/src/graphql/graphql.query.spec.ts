// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { createPostGraphQLSchema } from 'postgraphile';
import { ApolloServer, gql } from 'apollo-server-express';
import { DatabaseOperate } from '../database/database.operate';
import { plugins } from './plugins';

const timeout = 10000;

describe('Graphql query', () => {
  const dbSchema = 'test';
  const testTable = 'graphql';

  let databaseService: DatabaseOperate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          load: [
            () => ({
              DB_DATABASE: process.env.DB_DATABASE || 'postgres',
              DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
              DB_USER: process.env.DB_USER || 'postgres',
              DB_HOST: process.env.DB_HOST || '127.0.0.1',
              DB_PORT: process.env.DB_PORT || 5432,
            }),
          ],
        }),
      ],
      providers: [DatabaseOperate],
    }).compile();
    databaseService = module.get<DatabaseOperate>(DatabaseOperate);

    const pool = databaseService.getPgPool();

    await pool.query(`CREATE SCHEMA IF NOT EXISTS ${dbSchema}`);
    await pool.query(`CREATE TABLE IF NOT EXISTS ${dbSchema}.${testTable} (
            messageId character varying(255)  NOT NULL,
            soureChain character varying(255),
            CONSTRAINT  pk_messageId PRIMARY KEY (messageId)
        )`);
  });

  afterEach(async () => {
    await databaseService.getPgPool().query(`DROP TABLE test.graphql`);
  });
  afterAll(async () => {
    await databaseService.onModuleDestroy();
  });

  it(
    'graphql query one message',
    async () => {
      const pool = databaseService.getPgPool();
      await pool.query(`INSERT INTO test.graphql(
            messageId, soureChain )
            VALUES ('0x12', 'Crab');`);

      await pool.query(`INSERT INTO test.graphql(
            messageId, soureChain )
            VALUES ('0x13', 'Pangoro');`);

      const schema = await createPostGraphQLSchema(pool, [dbSchema], {
        replaceAllPlugins: plugins,
        dynamicJson: true,
        subscriptions: true,
        ignoreRBAC: false,
      });

      const server = new ApolloServer({
        schema,
        context: {
          pgClient: pool,
        },
      });

      await server.start();

      const GET_META = gql`
        query {
          graphql(messageid: "0x13") {
            messageid
            sourechain
          }
        }
      `;

      const mock = {
        messageid: '0x13',
        sourechain: 'Pangoro',
      };

      const results = await server.executeOperation({ query: GET_META });
      const fetchedMeta = results.data.graphql;

      expect(fetchedMeta).toMatchObject(mock);
    },
    timeout
  );

  it(
    'graphql null field',
    async () => {
      const pool = databaseService.getPgPool();
      await pool.query(`INSERT INTO test.graphql(
            messageId, soureChain )
            VALUES ('0x12', 'Crab');`);

      const schema = await createPostGraphQLSchema(pool, [dbSchema], {
        replaceAllPlugins: plugins,
        dynamicJson: true,
        subscriptions: true,
        ignoreRBAC: false,
      });

      const server = new ApolloServer({
        schema,
        context: {
          pgClient: pool,
        },
      });

      await server.start();

      const GET_META = gql`
        query {
          graphql(messageid: "0x99") {
            messageid
            sourechain
          }
        }
      `;

      const results = await server.executeOperation({ query: GET_META });
      const fetchedMeta = results.data.graphql;
      expect(fetchedMeta).toBeNull();
    },
    timeout
  );
});
