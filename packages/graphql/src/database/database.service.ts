import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pgPool: Pool = new Pool({
    port: this.configService.get<number>('PGPORT'),
    password: this.configService.get<string>('PGPASSWORD'),
    user: this.configService.get<string>('PGUSER'),
    host: this.configService.get<string>('PGHOST'),
    database: this.configService.get<string>('PGDATABASE'),
    ssl: false,
  });

  constructor(public configService: ConfigService) {}
  async onModuleDestroy() {
    await this.pgPool.end();
  }
  public getPgPool(): Pool {
    return this.pgPool;
  }

  async onModuleInit() {
    this.pgPool.on('error', (err) => {
      this.logger.error('Unexpected error on idle client', err.message);
    });
    this.logger.log('database service initilize');
  }

  async getSchema(name: string): Promise<string> {
    if (this.pgPool === undefined) {
      throw new Error("postgres pool don't initilize");
    }
    const { rows } = await this.pgPool.query(
      'SELECT nspname FROM pg_catalog.pg_namespace where nspname = $1',
      [name]
    );
    if (rows.length == 0) {
      throw new Error(`unkown schema ${name}`);
    }

    return rows[0].nspname;
  }
}
